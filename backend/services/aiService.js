import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateAIItinerary = async (destination, duration, budget, travelStyle, interests) => {
  const days = parseInt(duration, 10) || 3;
  const style = travelStyle || 'Culture';
  const interestsList = Array.isArray(interests) ? interests : [interests];

  // 1. Find matching cities from database
  const allCities = await prisma.city.findMany({
    include: { activities: true }
  });

  const destLower = destination.toLowerCase();
  let matchedCities = [];

  // Match keyword rules
  if (destLower.includes('rajasthan')) {
    matchedCities = allCities.filter(c => c.name === 'Udaipur' || c.name === 'Jaipur');
  } else if (destLower.includes('gujarat') || destLower.includes('ahmedabad')) {
    matchedCities = allCities.filter(c => c.name === 'Ahmedabad');
  } else if (destLower.includes('goa')) {
    matchedCities = allCities.filter(c => c.name === 'Goa');
  } else if (destLower.includes('france') || destLower.includes('paris')) {
    matchedCities = allCities.filter(c => c.name === 'Paris');
  } else if (destLower.includes('japan') || destLower.includes('tokyo')) {
    matchedCities = allCities.filter(c => c.name === 'Tokyo');
  } else if (destLower.includes('india')) {
    matchedCities = allCities.filter(c => ['Ahmedabad', 'Udaipur', 'Jaipur', 'Goa'].includes(c.name));
  } else {
    // Default to a selection based on budget/style or popularity
    matchedCities = allCities.slice(0, 2);
  }

  if (matchedCities.length === 0) {
    matchedCities = [allCities[0]];
  }

  // 2. Distribute days across matched cities
  const stops = [];
  const daysPerCity = Math.max(1, Math.floor(days / matchedCities.length));
  let remainingDays = days;

  matchedCities.forEach((city, index) => {
    const cityDays = (index === matchedCities.length - 1) ? remainingDays : daysPerCity;
    remainingDays -= cityDays;
    stops.push({
      city,
      durationDays: cityDays
    });
  });

  // 3. Generate day-by-day activities
  const dayPlans = [];
  let currentDay = 1;

  for (const stop of stops) {
    const city = stop.city;
    // Filter activities matching interests or style, fallback to any
    let availableActs = city.activities.filter(act => {
      const matchCat = interestsList.some(int => act.category.toLowerCase().includes(int.toLowerCase())) || 
                       act.category.toLowerCase() === style.toLowerCase();
      return matchCat;
    });

    if (availableActs.length === 0) {
      availableActs = city.activities;
    }

    for (let d = 0; d < stop.durationDays; d++) {
      const dayActivities = [];
      
      // Schedule morning activity (e.g. 10:00 AM - 12:00 PM)
      if (availableActs.length > 0) {
        const morningAct = availableActs[d % availableActs.length];
        dayActivities.push({
          activityId: morningAct.id,
          name: morningAct.name,
          category: morningAct.category,
          estimatedCost: morningAct.estimatedCost,
          duration: morningAct.duration,
          startTime: '10:00',
          endTime: '12:00',
          notes: 'Suggested morning exploration.'
        });
      }

      // Schedule afternoon/evening activity (e.g. 04:00 PM - 06:00 PM)
      if (availableActs.length > 1) {
        const afternoonAct = availableActs[(d + 1) % availableActs.length];
        dayActivities.push({
          activityId: afternoonAct.id,
          name: afternoonAct.name,
          category: afternoonAct.category,
          estimatedCost: afternoonAct.estimatedCost,
          duration: afternoonAct.duration,
          startTime: '16:00',
          endTime: '18:00',
          notes: 'Suggested afternoon sightseeing.'
        });
      } else if (city.activities.length > 1) {
        // Fallback to any activity in the city
        const fallbackAct = city.activities.find(a => !dayActivities.some(da => da.activityId === a.id)) || city.activities[0];
        dayActivities.push({
          activityId: fallbackAct.id,
          name: fallbackAct.name,
          category: fallbackAct.category,
          estimatedCost: fallbackAct.estimatedCost,
          duration: fallbackAct.duration,
          startTime: '16:00',
          endTime: '18:00',
          notes: 'Afternoon city highlight walk.'
        });
      }

      dayPlans.push({
        day: currentDay,
        cityName: city.name,
        cityId: city.id,
        activities: dayActivities
      });

      currentDay++;
    }
  }

  // Calculate estimated budget
  const estimatedCost = dayPlans.reduce((sum, day) => {
    return sum + day.activities.reduce((dSum, act) => dSum + act.estimatedCost, 0);
  }, 0);

  return {
    destination,
    durationDays: days,
    travelStyle: style,
    budget,
    estimatedCost,
    stops: stops.map((s, index) => ({
      cityId: s.city.id,
      cityName: s.city.name,
      country: s.city.country,
      sequence: index,
      days: s.durationDays
    })),
    itinerary: dayPlans
  };
};
