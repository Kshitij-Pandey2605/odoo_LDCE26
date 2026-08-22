import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to convert "HH:MM" string to minutes from midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Check for overlapping activities
const checkOverlap = async (tripStopId, dateStr, startTime, endTime, excludeActivityId = null) => {
  const targetDate = new Date(dateStr);
  
  // Find all scheduled activities for the same stop and date
  const scheduled = await prisma.tripActivity.findMany({
    where: {
      tripStopId,
      date: targetDate,
      id: excludeActivityId ? { not: excludeActivityId } : undefined
    },
    include: {
      activity: true
    }
  });

  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);

  for (const act of scheduled) {
    const actStart = timeToMinutes(act.startTime);
    const actEnd = timeToMinutes(act.endTime);

    // Overlap condition: startA < endB and endA > startB
    if (startMin < actEnd && endMin > actStart) {
      const name = act.activity?.name || act.customName || 'Another Activity';
      return {
        conflict: true,
        message: `Overlaps with "${name}" (${act.startTime} - ${act.endTime})`
      };
    }
  }

  return { conflict: false };
};

export const getActivities = async (req, res) => {
  try {
    const { cityId, category, search } = req.query;

    const filters = {};
    if (cityId) filters.cityId = cityId;
    if (category) filters.category = category;
    if (search) {
      filters.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const activities = await prisma.activity.findMany({
      where: filters,
      orderBy: { name: 'asc' }
    });

    res.json(activities);
  } catch (error) {
    console.error('Get Activities Error:', error);
    res.status(500).json({ error: 'Failed to fetch activities.' });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({
      where: { id }
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Get Activity By ID Error:', error);
    res.status(500).json({ error: 'Failed to retrieve activity.' });
  }
};

export const scheduleActivity = async (req, res) => {
  try {
    const { tripStopId, activityId, customName, customCost, date, startTime, endTime, notes } = req.body;

    if (!tripStopId || (!activityId && !customName) || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Stop, activity/name, date, start time, and end time are required.' });
    }

    const stop = await prisma.tripStop.findUnique({
      where: { id: tripStopId },
      include: { trip: true }
    });

    if (!stop) {
      return res.status(404).json({ error: 'Trip stop not found.' });
    }

    const targetDate = new Date(date);
    
    // Check if scheduled date falls within stop dates
    // Truncate times for day accuracy
    const compareDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const stopStart = new Date(stop.startDate.getFullYear(), stop.startDate.getMonth(), stop.startDate.getDate());
    const stopEnd = new Date(stop.endDate.getFullYear(), stop.endDate.getMonth(), stop.endDate.getDate());

    if (compareDate < stopStart || compareDate > stopEnd) {
      return res.status(400).json({ error: `Activity date must be between stop dates: ${stopStart.toLocaleDateString()} to ${stopEnd.toLocaleDateString()}` });
    }

    // Verify time validation
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      return res.status(400).json({ error: 'End time must be after start time.' });
    }

    // Check conflict overlaps
    const overlapCheck = await checkOverlap(tripStopId, date, startTime, endTime);

    // Count day activities to warn if too busy
    const dailyCount = await prisma.tripActivity.count({
      where: { tripStopId, date: targetDate }
    });
    
    const warning = dailyCount >= 5 ? 'Warning: You have scheduled more than 5 activities for this day.' : null;

    // Save scheduled item
    const scheduledActivity = await prisma.tripActivity.create({
      data: {
        tripStopId,
        activityId: activityId || null,
        customName: activityId ? null : customName,
        customCost: activityId ? null : (customCost ? parseFloat(customCost) : 0),
        date: targetDate,
        startTime,
        endTime,
        notes,
      },
      include: {
        activity: true
      }
    });

    res.status(201).json({
      activity: scheduledActivity,
      conflict: overlapCheck.conflict ? overlapCheck.message : null,
      warning
    });
  } catch (error) {
    console.error('Schedule Activity Error:', error);
    res.status(500).json({ error: 'Failed to schedule activity.' });
  }
};

export const updateScheduledActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, notes, customName, customCost } = req.body;

    const scheduled = await prisma.tripActivity.findUnique({
      where: { id },
      include: { tripStop: true }
    });

    if (!scheduled) {
      return res.status(404).json({ error: 'Scheduled activity not found.' });
    }

    const updateData = {};
    if (notes !== undefined) updateData.notes = notes;
    if (customName !== undefined) updateData.customName = customName;
    if (customCost !== undefined) updateData.customCost = parseFloat(customCost);

    let checkDate = scheduled.date;
    let checkStart = scheduled.startTime;
    let checkEnd = scheduled.endTime;

    if (date) {
      updateData.date = new Date(date);
      checkDate = updateData.date;
    }
    if (startTime) {
      updateData.startTime = startTime;
      checkStart = startTime;
    }
    if (endTime) {
      updateData.endTime = endTime;
      checkEnd = endTime;
    }

    // Time validation
    if (timeToMinutes(checkEnd) <= timeToMinutes(checkStart)) {
      return res.status(400).json({ error: 'End time must be after start time.' });
    }

    // Overlap checks
    const overlapCheck = await checkOverlap(scheduled.tripStopId, checkDate, checkStart, checkEnd, id);

    const updated = await prisma.tripActivity.update({
      where: { id },
      data: updateData,
      include: { activity: true }
    });

    res.json({
      activity: updated,
      conflict: overlapCheck.conflict ? overlapCheck.message : null
    });
  } catch (error) {
    console.error('Update Scheduled Activity Error:', error);
    res.status(500).json({ error: 'Failed to update scheduled activity.' });
  }
};

export const deleteScheduledActivity = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.tripActivity.delete({
      where: { id }
    });

    res.json({ message: 'Activity removed from itinerary.' });
  } catch (error) {
    console.error('Delete Scheduled Activity Error:', error);
    res.status(500).json({ error: 'Failed to delete scheduled activity.' });
  }
};
