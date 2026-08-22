import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, language, profileImage } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      // Check if email already taken
      const existing = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          id: { not: userId }
        }
      });
      if (existing) {
        return res.status(400).json({ error: 'This email is already registered to another account.' });
      }
      updateData.email = email.toLowerCase();
    }
    if (language) updateData.language = language;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        language: true,
        profileImage: true,
        role: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update profile settings.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
};

export const getSavedDestinations = async (req, res) => {
  try {
    const userId = req.user.id;

    const saved = await prisma.savedDestination.findMany({
      where: { userId },
      include: {
        city: true
      }
    });

    res.json(saved);
  } catch (error) {
    console.error('Get Saved Destinations Error:', error);
    res.status(500).json({ error: 'Failed to fetch saved destinations.' });
  }
};

export const saveDestination = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cityId } = req.body;

    if (!cityId) {
      return res.status(400).json({ error: 'City ID is required.' });
    }

    const city = await prisma.city.findUnique({
      where: { id: cityId }
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found.' });
    }

    // Check if already saved
    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_cityId: { userId, cityId }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Destination is already saved.' });
    }

    const saved = await prisma.savedDestination.create({
      data: {
        userId,
        cityId
      },
      include: {
        city: true
      }
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error('Save Destination Error:', error);
    res.status(500).json({ error: 'Failed to save destination.' });
  }
};

export const unsaveDestination = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // Can be savedDestinationId or cityId

    // Try deleting by direct ID first
    try {
      const saved = await prisma.savedDestination.findUnique({
        where: { id }
      });

      if (saved && saved.userId === userId) {
        await prisma.savedDestination.delete({
          where: { id }
        });
        return res.json({ message: 'Destination removed from saved list.' });
      }
    } catch (e) {
      // Ignore and fallback to delete by cityId
    }

    // Fallback delete by userId + cityId
    const check = await prisma.savedDestination.findFirst({
      where: { userId, cityId: id }
    });

    if (!check) {
      return res.status(404).json({ error: 'Saved destination record not found.' });
    }

    await prisma.savedDestination.delete({
      where: { id: check.id }
    });

    res.json({ message: 'Destination removed from saved list.' });
  } catch (error) {
    console.error('Unsave Destination Error:', error);
    res.status(500).json({ error: 'Failed to remove saved destination.' });
  }
};
