import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCities = async (req, res) => {
  try {
    const { search, country, region, minCost, maxCost, minPopularity } = req.query;

    const filters = {};

    if (search) {
      filters.OR = [
        { name: { contains: search, select: undefined } }, // SQLite search contains is case-insensitive by default in some configurations, or we can use standard string search
        { country: { contains: search } },
        { region: { contains: search } },
      ];
    }

    if (country) {
      filters.country = { equals: country };
    }

    if (region) {
      filters.region = { equals: region };
    }

    if (minCost || maxCost) {
      filters.costIndex = {};
      if (minCost) filters.costIndex.gte = parseInt(minCost, 10);
      if (maxCost) filters.costIndex.lte = parseInt(maxCost, 10);
    }

    if (minPopularity) {
      filters.popularity = { gte: parseFloat(minPopularity) };
    }

    const cities = await prisma.city.findMany({
      where: filters,
      orderBy: { popularity: 'desc' },
      include: {
        activities: {
          select: {
            id: true,
            name: true,
            category: true,
            estimatedCost: true,
          }
        }
      }
    });

    res.json(cities);
  } catch (error) {
    console.error('Get Cities Error:', error);
    res.status(500).json({ error: 'Failed to fetch destinations.' });
  }
};

export const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        activities: true,
      },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found.' });
    }

    res.json(city);
  } catch (error) {
    console.error('Get City By ID Error:', error);
    res.status(500).json({ error: 'Failed to retrieve city details.' });
  }
};
