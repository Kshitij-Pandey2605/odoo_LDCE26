import React, { useState, useEffect } from 'react';
import { useParams as useRouterParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, Calendar, Plus, Trash2, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';

const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#f43f5e', '#64748b'];

const TripBudget = () => {
  const { tripId } = useRouterParams();
  const { toastSuccess, toastError, toastWarning } = useToast();

  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState(null); // Contains analysis & expenses list
  
  // Add expense form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadExpenses = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}/expenses`);
      setExpenseData(response.data);
      if (response.data.expenses?.length > 0) {
        // Default expense date to today
        setExpenseDate(new Date().toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error('Failed to load expense report:', error);
      toastError('Failed to fetch budget analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [tripId]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!category || !amount || !description || !expenseDate) {
      toastWarning('Please fill in all expense details.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toastError('Amount must be positive.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/api/trips/${tripId}/expenses`, {
        category,
        amount: parseFloat(amount),
        description,
        date: expenseDate
      });

      toastSuccess('Expense logged successfully!');
      setShowAddForm(false);
      setAmount('');
      setDescription('');
      loadExpenses();
    } catch (error) {
      console.error('Failed to save expense:', error);
      toastError('Failed to record expense log.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense log?')) return;

    try {
      await api.delete(`/api/expenses/${id}`);
      toastSuccess('Expense log removed.');
      loadExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toastError('Failed to remove expense record.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
      </div>
    );
  }

  const { expenses, analysis } = expenseData || { expenses: [], analysis: {} };
  const hasPieData = analysis.categoryData?.some(c => c.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Quick stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Wallet className="h-6 w-6 text-brand-secondary" />
            Trip Budget Center
          </h1>
          <p className="text-slate-500 text-xs mt-1">Track actual spending against your travel budget limit.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 bg-brand-primary hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold transition-all hover-lift shadow-premium text-xs"
        >
          <Plus className="h-4 w-4" />
          Log Expense
        </button>
      </div>

      {/* Over-budget Warnings box */}
      {analysis.isOverBudget ? (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-800 text-xs">
          <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0" />
          <div>
            <strong>⚠️ Over Budget Alert:</strong> You are ₹{Math.abs(analysis.remainingBudget).toLocaleString('en-IN')} over your maximum trip budget.
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 text-xs">
          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <div>
            <strong>✓ Within Budget:</strong> You are safely within your budget limit. ₹{analysis.remainingBudget.toLocaleString('en-IN')} remains.
          </div>
        </div>
      )}

      {/* Main Stats panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget Limit', val: `₹${analysis.totalBudget?.toLocaleString('en-IN')}`, color: 'border-slate-100' },
          { label: 'Estimated Stops Cost', val: `₹${analysis.estimatedSpending?.toLocaleString('en-IN')}`, color: 'border-slate-100' },
          { label: 'Actual Spending Logged', val: `₹${analysis.actualSpending?.toLocaleString('en-IN')}`, color: analysis.isOverBudget ? 'border-rose-200 text-rose-600' : 'border-emerald-200 text-emerald-600' },
          { label: 'Average Spent per Day', val: `₹${Math.round(analysis.averagePerDay)?.toLocaleString('en-IN')}`, color: 'border-slate-100' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border shadow-sm space-y-1 ${stat.color}`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-lg font-extrabold text-slate-900">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Add expense inline popover */}
      {showAddForm && (
        <form onSubmit={handleAddExpense} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-4 animate-slide-down text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Record a New Actual Expense</h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400">Close</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
              >
                {['Transport', 'Accommodation', 'Food', 'Activities', 'Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹1500"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Description</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Dinner at Agashiye restaurant"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Date</label>
              <input
                type="date"
                required
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl"
          >
            {submitting ? 'Logging...' : 'Confirm Log Expense'}
          </button>
        </form>
      )}

      {/* Grid of charts and advice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recharts category distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Expense Distribution</h3>
          {hasPieData ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysis.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analysis.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400 italic">
              No expense data logged to display chart.
            </div>
          )}
        </div>

        {/* Middle Column: Daily Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Daily Spending Timeline</h3>
          {analysis.dailyData?.length > 0 ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400 italic">
              No daily metrics to map.
            </div>
          )}
        </div>

        {/* Right Column: AI Smart Suggestions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
            <TrendingDown className="h-4 w-4 text-brand-accent" />
            Budget Optimization Tips
          </h3>
          <div className="space-y-3">
            {analysis.suggestions?.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Awesome! No warning recommendations needed at this time.
              </p>
            ) : (
              analysis.suggestions?.map((sug, idx) => (
                <div key={idx} className="bg-sky-50/50 border border-sky-100 p-3 rounded-xl text-xs text-slate-700 font-medium">
                  {sug}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Log list list */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Expense Activity Logs</h3>
        {expenses.length === 0 ? (
          <p className="text-xs text-slate-450 italic text-center py-4">No expense items logged for this trip yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-500">
              <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 rounded-lg">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{exp.description}</td>
                    <td className="px-4 py-3.5">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase font-semibold text-[9px]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-900 text-right">₹{exp.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-slate-300 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete expense entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripBudget;
