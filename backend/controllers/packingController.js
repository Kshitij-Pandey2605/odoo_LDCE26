import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultPackingList = [
  { name: 'T-shirts & Shirts', category: 'Clothes' },
  { name: 'Jeans & Shorts', category: 'Clothes' },
  { name: 'Socks & Underwear', category: 'Clothes' },
  { name: 'Comfortable Walking Shoes', category: 'Clothes' },
  { name: 'Phone Charger', category: 'Electronics' },
  { name: 'Power Bank', category: 'Electronics' },
  { name: 'Universal Travel Adapter', category: 'Electronics' },
  { name: 'Passport / ID Cards', category: 'Documents' },
  { name: 'Flight & Hotel Bookings', category: 'Documents' },
  { name: 'Insurance Copy', category: 'Documents' },
  { name: 'First-Aid Kit & Basic Meds', category: 'Health' },
  { name: 'Hand Sanitizer & Masks', category: 'Health' },
  { name: 'Toiletry Kit', category: 'Health' },
  { name: 'Sunglasses', category: 'Accessories' },
  { name: 'Travel Pillow', category: 'Accessories' },
  { name: 'Travel Lock', category: 'Accessories' }
];

export const getPackingItems = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Verify trip ownership/membership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true, packingItems: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    const isMember = trip.members.some(m => m.userId === userId);
    if (!isMember && trip.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to view this packing list.' });
    }

    // Auto-generate defaults if checklist is empty
    if (trip.packingItems.length === 0) {
      const items = defaultPackingList.map(item => ({
        tripId,
        name: item.name,
        category: item.category,
        isPacked: false
      }));

      await prisma.packingItem.createMany({
        data: items
      });

      // Fetch newly created items
      const generated = await prisma.packingItem.findMany({
        where: { tripId }
      });

      return res.json(generated);
    }

    res.json(trip.packingItems);
  } catch (error) {
    console.error('Get Packing Items Error:', error);
    res.status(500).json({ error: 'Failed to fetch packing list.' });
  }
};

export const addPackingItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name, category } = req.body;
    const userId = req.user.id;

    if (!name || !category) {
      return res.status(400).json({ error: 'Item name and category are required.' });
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
      return res.status(403).json({ error: 'You do not have permission to modify this checklist.' });
    }

    const newItem = await prisma.packingItem.create({
      data: {
        tripId,
        name,
        category,
        isPacked: false
      }
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Add Packing Item Error:', error);
    res.status(500).json({ error: 'Failed to add packing item.' });
  }
};

export const updatePackingItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, isPacked } = req.body;
    const userId = req.user.id;

    const item = await prisma.packingItem.findUnique({
      where: { id },
      include: {
        trip: {
          include: { members: true }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Packing item not found.' });
    }

    const member = item.trip.members.find(m => m.userId === userId);
    if (item.trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to modify this checklist.' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (isPacked !== undefined) updateData.isPacked = isPacked;

    const updated = await prisma.packingItem.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Packing Item Error:', error);
    res.status(500).json({ error: 'Failed to update packing item.' });
  }
};

export const deletePackingItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await prisma.packingItem.findUnique({
      where: { id },
      include: {
        trip: {
          include: { members: true }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Packing item not found.' });
    }

    const member = item.trip.members.find(m => m.userId === userId);
    if (item.trip.userId !== userId && (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR'))) {
      return res.status(403).json({ error: 'You do not have permission to delete checklist items.' });
    }

    await prisma.packingItem.delete({
      where: { id }
    });

    res.json({ message: 'Item deleted.' });
  } catch (error) {
    console.error('Delete Packing Item Error:', error);
    res.status(500).json({ error: 'Failed to delete packing item.' });
  }
};
