import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Helper to determine status based on dates
const getTripStatus = (startDateStr, endDateStr) => {
  const now = new Date();
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (now < start) return 'Upcoming';
  if (now > end) return 'Completed';
  return 'Ongoing';
};

export const createTrip = async (req, res) => {
  try {
    const { name, description, startDate, endDate, coverImage, tripType, travelStyle, budget } = req.body;

    if (!name || !startDate || !endDate || budget === undefined) {
      return res.status(400).json({ error: 'Name, dates, and budget are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ error: 'End date cannot be before start date.' });
    }

    const status = getTripStatus(startDate, endDate);

    // Default cover image if none provided
    const defaultCover = coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        name,
        description,
        startDate: start,
        endDate: end,
        coverImage: defaultCover,
        tripType: tripType || 'Solo',
        travelStyle: travelStyle || 'Relaxation',
        budget: parseFloat(budget),
        status,
        members: {
          create: {
            userId: req.user.id,
            role: 'OWNER',
          }
        }
      },
      include: {
        members: true
      }
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Create Trip Error:', error);
    res.status(500).json({ error: 'Failed to create trip.' });
  }
};

export const getTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all trips owned by user or where they are a member
    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        stops: {
          include: {
            city: {
              select: { name: true, country: true }
            }
          }
        },
        expenses: {
          select: { amount: true }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    // Update statuses dynamically before sending (in case dates elapsed)
    const updatedTrips = await Promise.all(trips.map(async (trip) => {
      const currentStatus = getTripStatus(trip.startDate, trip.endDate);
      if (trip.status !== currentStatus && trip.status !== 'Draft') {
        const updated = await prisma.trip.update({
          where: { id: trip.id },
          data: { status: currentStatus },
          include: {
            stops: {
              include: {
                city: { select: { name: true, country: true } }
              }
            },
            expenses: { select: { amount: true } }
          }
        });
        return updated;
      }
      return trip;
    }));

    res.json(updatedTrips);
  } catch (error) {
    console.error('Get Trips Error:', error);
    res.status(500).json({ error: 'Failed to retrieve trips.' });
  }
};

export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            city: true,
            activities: {
              include: {
                activity: true,
              },
              orderBy: { startTime: 'asc' }
            }
          },
          orderBy: { sequence: 'asc' }
        },
        expenses: true,
        packingItems: true,
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, profileImage: true }
            }
          }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    // Check permissions (either owner, collaborator, or isPublic)
    const isMember = trip.members.some(member => member.userId === userId);
    if (!isMember && !trip.isPublic && trip.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to view this trip.' });
    }

    // Append user role in this trip
    const memberRecord = trip.members.find(member => member.userId === userId);
    const userRole = memberRecord ? memberRecord.role : (trip.userId === userId ? 'OWNER' : 'VIEWER');

    res.json({ ...trip, userRole });
  } catch (error) {
    console.error('Get Trip By ID Error:', error);
    res.status(500).json({ error: 'Failed to retrieve trip details.' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, startDate, endDate, coverImage, tripType, travelStyle, budget, isPublic } = req.body;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    // Verify user is owner or editor
    const member = trip.members.find(m => m.userId === userId);
    if (trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to update this trip.' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (coverImage) updateData.coverImage = coverImage;
    if (tripType) updateData.tripType = tripType;
    if (travelStyle) updateData.travelStyle = travelStyle;
    if (budget !== undefined) updateData.budget = parseFloat(budget);
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    // Dynamically calculate status if dates changed
    if (startDate || endDate) {
      const s = startDate || trip.startDate;
      const e = endDate || trip.endDate;
      updateData.status = getTripStatus(s, e);
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: updateData
    });

    res.json(updatedTrip);
  } catch (error) {
    console.error('Update Trip Error:', error);
    res.status(500).json({ error: 'Failed to update trip.' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    // Only Owner can delete
    const member = trip.members.find(m => m.userId === userId);
    const isOwner = trip.userId === userId || (member && member.role === 'OWNER');
    
    if (!isOwner) {
      return res.status(403).json({ error: 'Only the trip owner can delete it.' });
    }

    await prisma.trip.delete({
      where: { id }
    });

    res.json({ message: 'Trip deleted successfully.' });
  } catch (error) {
    console.error('Delete Trip Error:', error);
    res.status(500).json({ error: 'Failed to delete trip.' });
  }
};

export const duplicateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const sourceTrip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            activities: true
          }
        },
        packingItems: true
      }
    });

    if (!sourceTrip) {
      return res.status(404).json({ error: 'Source trip not found.' });
    }

    // Create duplicated trip
    const duplicatedTrip = await prisma.trip.create({
      data: {
        userId,
        name: `Copy of ${sourceTrip.name}`,
        description: sourceTrip.description,
        startDate: sourceTrip.startDate,
        endDate: sourceTrip.endDate,
        coverImage: sourceTrip.coverImage,
        tripType: sourceTrip.tripType,
        travelStyle: sourceTrip.travelStyle,
        budget: sourceTrip.budget,
        status: sourceTrip.status,
        members: {
          create: {
            userId,
            role: 'OWNER',
          }
        }
      }
    });

    // Copy stops & activities
    for (const stop of sourceTrip.stops) {
      const createdStop = await prisma.tripStop.create({
        data: {
          tripId: duplicatedTrip.id,
          cityId: stop.cityId,
          startDate: stop.startDate,
          endDate: stop.endDate,
          sequence: stop.sequence,
        }
      });

      for (const act of stop.activities) {
        await prisma.tripActivity.create({
          data: {
            tripStopId: createdStop.id,
            activityId: act.activityId,
            customName: act.customName,
            customCost: act.customCost,
            date: act.date,
            startTime: act.startTime,
            endTime: act.endTime,
            notes: act.notes
          }
        });
      }
    }

    // Copy packing items (unpacked by default)
    if (sourceTrip.packingItems.length > 0) {
      await prisma.packingItem.createMany({
        data: sourceTrip.packingItems.map(item => ({
          tripId: duplicatedTrip.id,
          name: item.name,
          category: item.category,
          isPacked: false,
        }))
      });
    }

    res.status(201).json(duplicatedTrip);
  } catch (error) {
    console.error('Duplicate Trip Error:', error);
    res.status(500).json({ error: 'Failed to duplicate trip.' });
  }
};

export const shareTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    // Verify permission (OWNER or EDITOR)
    const member = trip.members.find(m => m.userId === userId);
    if (trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to share this trip.' });
    }

    let token = trip.shareToken;
    if (!token) {
      token = crypto.randomBytes(16).toString('hex');
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        isPublic: true,
        shareToken: token
      }
    });

    res.json({
      shareToken: updated.shareToken,
      url: `/share/${updated.shareToken}`
    });
  } catch (error) {
    console.error('Share Trip Error:', error);
    res.status(500).json({ error: 'Failed to share trip.' });
  }
};
