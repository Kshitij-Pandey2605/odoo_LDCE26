import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addStop = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { cityId, startDate, endDate } = req.body;
    const userId = req.user.id;

    if (!cityId || !startDate || !endDate) {
      return res.status(400).json({ error: 'City, start date, and end date are required.' });
    }

    // Verify trip ownership/membership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { stops: true, members: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    const member = trip.members.find(m => m.userId === userId);
    if (trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to modify this trip.' });
    }

    const stopStart = new Date(startDate);
    const stopEnd = new Date(endDate);

    // Validate that dates are within the main trip dates
    if (stopStart < trip.startDate || stopEnd > trip.endDate) {
      return res.status(400).json({ error: `Stop dates must fall within the trip duration: ${trip.startDate.toLocaleDateString()} to ${trip.endDate.toLocaleDateString()}` });
    }

    if (stopEnd < stopStart) {
      return res.status(400).json({ error: 'Stop end date cannot be before start date.' });
    }

    // Determine sequence number (append to end)
    const sequence = trip.stops.length;

    const newStop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        startDate: stopStart,
        endDate: stopEnd,
        sequence,
      },
      include: {
        city: true
      }
    });

    res.status(201).json(newStop);
  } catch (error) {
    console.error('Add Stop Error:', error);
    res.status(500).json({ error: 'Failed to add city stop.' });
  }
};

export const updateStop = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Dates are required.' });
    }

    const stop = await prisma.tripStop.findUnique({
      where: { id },
      include: {
        trip: {
          include: { members: true }
        }
      }
    });

    if (!stop) {
      return res.status(404).json({ error: 'Trip stop not found.' });
    }

    // Verify permission
    const member = stop.trip.members.find(m => m.userId === userId);
    if (stop.trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to modify this trip.' });
    }

    const stopStart = new Date(startDate);
    const stopEnd = new Date(endDate);

    // Check dates fit within trip
    if (stopStart < stop.trip.startDate || stopEnd > stop.trip.endDate) {
      return res.status(400).json({ error: `Stop dates must fall within the trip duration: ${stop.trip.startDate.toLocaleDateString()} to ${stop.trip.endDate.toLocaleDateString()}` });
    }

    if (stopEnd < stopStart) {
      return res.status(400).json({ error: 'Stop end date cannot be before start date.' });
    }

    const updatedStop = await prisma.tripStop.update({
      where: { id },
      data: {
        startDate: stopStart,
        endDate: stopEnd
      },
      include: { city: true }
    });

    res.json(updatedStop);
  } catch (error) {
    console.error('Update Stop Error:', error);
    res.status(500).json({ error: 'Failed to update trip stop.' });
  }
};

export const deleteStop = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const stop = await prisma.tripStop.findUnique({
      where: { id },
      include: {
        trip: {
          include: { members: true, stops: { orderBy: { sequence: 'asc' } } }
        }
      }
    });

    if (!stop) {
      return res.status(404).json({ error: 'Trip stop not found.' });
    }

    // Verify permission
    const member = stop.trip.members.find(m => m.userId === userId);
    if (stop.trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to modify this trip.' });
    }

    // Delete the stop
    await prisma.tripStop.delete({ where: { id } });

    // Re-sequence remaining stops
    const remainingStops = stop.trip.stops.filter(s => s.id !== id);
    for (let i = 0; i < remainingStops.length; i++) {
      await prisma.tripStop.update({
        where: { id: remainingStops[i].id },
        data: { sequence: i }
      });
    }

    res.json({ message: 'Trip stop removed successfully.' });
  } catch (error) {
    console.error('Delete Stop Error:', error);
    res.status(500).json({ error: 'Failed to remove trip stop.' });
  }
};

export const reorderStops = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { stopIds } = req.body; // Array of IDs in new order
    const userId = req.user.id;

    if (!stopIds || !Array.isArray(stopIds)) {
      return res.status(400).json({ error: 'List of stop IDs is required.' });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    const member = trip.members.find(m => m.userId === userId);
    if (trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to modify this trip.' });
    }

    // Update sequence numbers sequentially
    const updates = stopIds.map((id, index) => {
      return prisma.tripStop.update({
        where: { id },
        data: { sequence: index }
      });
    });

    await prisma.$transaction(updates);

    res.json({ message: 'Stops reordered successfully.' });
  } catch (error) {
    console.error('Reorder Stops Error:', error);
    res.status(500).json({ error: 'Failed to reorder trip stops.' });
  }
};
