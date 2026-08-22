import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Verify trip permission
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: true,
        stops: {
          include: {
            activities: {
              include: { activity: true }
            }
          }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    const isMember = trip.members.some(m => m.userId === userId);
    if (!isMember && trip.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to view expenses for this trip.' });
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: 'desc' }
    });

    // Calculate budget analysis
    const totalBudget = trip.budget;
    const actualSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remainingBudget = totalBudget - actualSpending;

    // Calculate estimated spending based on scheduled activities
    let estimatedSpending = 0;
    trip.stops.forEach(stop => {
      stop.activities.forEach(act => {
        const cost = act.activity ? act.activity.estimatedCost : (act.customCost || 0);
        estimatedSpending += cost;
      });
    });

    // Calculate category breakdowns for actual spending
    const categories = ['Transport', 'Accommodation', 'Food', 'Activities', 'Other'];
    const actualByCategory = categories.reduce((acc, cat) => {
      acc[cat] = 0;
      return acc;
    }, {});

    expenses.forEach(exp => {
      if (actualByCategory[exp.category] !== undefined) {
        actualByCategory[exp.category] += exp.amount;
      } else {
        actualByCategory['Other'] += exp.amount;
      }
    });

    const categoryData = Object.keys(actualByCategory).map(name => ({
      name,
      value: actualByCategory[name]
    }));

    // Calculate daily expenses breakdown
    const dailyExpensesMap = {};
    expenses.forEach(exp => {
      const dateStr = exp.date.toISOString().split('T')[0];
      dailyExpensesMap[dateStr] = (dailyExpensesMap[dateStr] || 0) + exp.amount;
    });

    const dailyData = Object.keys(dailyExpensesMap).map(date => ({
      date,
      amount: dailyExpensesMap[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Generate Smart Budget Suggestions
    const suggestions = [];
    const accommodationSpending = actualByCategory['Accommodation'] || 0;
    const foodSpending = actualByCategory['Food'] || 0;

    if (actualSpending > totalBudget) {
      suggestions.push(`You are over budget by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}. Consider reviewing your non-essential expenses.`);
    }

    if (accommodationSpending > totalBudget * 0.4) {
      suggestions.push(`Your accommodation costs are ${Math.round((accommodationSpending / actualSpending) * 100)}% of your expenses. Consider looking for lower-cost homestays or shared listings.`);
    }

    if (foodSpending > totalBudget * 0.25) {
      suggestions.push(`Food costs are ${Math.round((foodSpending / actualSpending) * 100)}% of your expenses. Try exploring local street food markets (like Manek Chowk if in Ahmedabad) to save money.`);
    }

    if (actualSpending <= totalBudget && remainingBudget < totalBudget * 0.1) {
      suggestions.push('You are approaching your budget limit. Watch out for miscellaneous purchases.');
    }

    res.json({
      expenses,
      analysis: {
        totalBudget,
        actualSpending,
        remainingBudget,
        estimatedSpending,
        isOverBudget: actualSpending > totalBudget,
        averagePerDay: expenses.length > 0 ? (actualSpending / Math.max(1, Math.round((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24)))) : 0,
        categoryData,
        dailyData,
        suggestions
      }
    });
  } catch (error) {
    console.error('Get Expenses Error:', error);
    res.status(500).json({ error: 'Failed to retrieve expenses.' });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { category, amount, description, date } = req.body;
    const userId = req.user.id;

    if (!category || amount === undefined || !description || !date) {
      return res.status(400).json({ error: 'Category, amount, description, and date are required.' });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    // Verify permission (Owner or Editor)
    const member = trip.members.find(m => m.userId === userId);
    if (trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to add expenses to this trip.' });
    }

    const newExpense = await prisma.expense.create({
      data: {
        tripId,
        category,
        amount: parseFloat(amount),
        description,
        date: new Date(date)
      }
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Add Expense Error:', error);
    res.status(500).json({ error: 'Failed to log expense.' });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, description, date } = req.body;
    const userId = req.user.id;

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        trip: {
          include: { members: true }
        }
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense log not found.' });
    }

    // Verify permission
    const member = expense.trip.members.find(m => m.userId === userId);
    if (expense.trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to modify expenses for this trip.' });
    }

    const updateData = {};
    if (category) updateData.category = category;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(date);

    const updated = await prisma.expense.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Expense Error:', error);
    res.status(500).json({ error: 'Failed to update expense.' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        trip: {
          include: { members: true }
        }
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense log not found.' });
    }

    // Verify permission
    const member = expense.trip.members.find(m => m.userId === userId);
    if (expense.trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to delete expenses for this trip.' });
    }

    await prisma.expense.delete({
      where: { id }
    });

    res.json({ message: 'Expense logged deleted successfully.' });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
};
