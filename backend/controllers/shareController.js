import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSharedTrip = async (req, res) => {
  try {
    const { token } = req.params;

    const trip = await prisma.trip.findFirst({
      where: {
        shareToken: token,
        isPublic: true,
      },
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
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Shared trip not found or is no longer public.' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Get Shared Trip Error:', error);
    res.status(500).json({ error: 'Failed to retrieve shared trip.' });
  }
};

export const copySharedTrip = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id; // Logged-in user copy

    const sourceTrip = await prisma.trip.findFirst({
      where: {
        shareToken: token,
        isPublic: true,
      },
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
      return res.status(404).json({ error: 'Shared trip not found or is no longer public.' });
    }

    // Create a copy of the trip for the current user
    const duplicatedTrip = await prisma.trip.create({
      data: {
        userId,
        name: `${sourceTrip.name} (Customized)`,
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

    // Copy packing items
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
    console.error('Copy Shared Trip Error:', error);
    res.status(500).json({ error: 'Failed to copy trip.' });
  }
};
