import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const citiesData = [
  {
    name: 'Ahmedabad',
    country: 'India',
    region: 'Gujarat',
    description: 'India\'s first UNESCO World Heritage City, famous for its historic architecture, vibrant street food, and textile heritage.',
    image: 'https://images.unsplash.com/photo-1603258591395-5cb954546bf7?auto=format&fit=crop&w=800&q=80',
    costIndex: 2,
    popularity: 4.2,
    latitude: 23.0225,
    longitude: 72.5714,
    activities: {
      create: [
        {
          name: 'Sabarmati Ashram Visit',
          description: 'The peaceful residence of Mahatma Gandhi along the banks of the Sabarmati River. Offers a rich look into India\'s independence movement.',
          category: 'Culture',
          duration: 120,
          estimatedCost: 0,
          latitude: 23.0608,
          longitude: 72.5804
        },
        {
          name: 'Adalaj Stepwell Exploration',
          description: 'A stunning five-story deep hand-carved sandstone stepwell built in 1498, showcasing spectacular Solanki architecture.',
          category: 'Sightseeing',
          duration: 90,
          estimatedCost: 50,
          latitude: 23.1667,
          longitude: 72.5801
        },
        {
          name: 'Sabarmati Riverfront Walk',
          description: 'Enjoy a pleasant evening stroll along the beautifully developed riverfront park with breezes and sunset views.',
          category: 'Nature',
          duration: 60,
          estimatedCost: 10,
          latitude: 23.0305,
          longitude: 72.5739
        },
        {
          name: 'Street Food Tour at Manek Chowk',
          description: 'Experience Ahmedabad\'s famous night food market. Try the giant Gwalior Dosa, Pineapple Sandwich, and Kulfi.',
          category: 'Food',
          duration: 120,
          estimatedCost: 250,
          latitude: 23.0249,
          longitude: 72.5898
        }
      ]
    }
  },
  {
    name: 'Udaipur',
    country: 'India',
    region: 'Rajasthan',
    description: 'The "City of Lakes" and "Venice of the East". A romantic destination filled with grand palaces, scenic lakes, and historic temples.',
    image: 'https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?auto=format&fit=crop&w=800&q=80',
    costIndex: 3,
    popularity: 4.8,
    latitude: 24.5854,
    longitude: 73.7125,
    activities: {
      create: [
        {
          name: 'City Palace Tour',
          description: 'A majestic palace complex built over 400 years, showcasing a blend of Rajasthani and Mughal architectural styles.',
          category: 'Culture',
          duration: 180,
          estimatedCost: 300,
          latitude: 24.5764,
          longitude: 73.6835
        },
        {
          name: 'Lake Pichola Boat Ride',
          description: 'A scenic boat ride on Lake Pichola during sunset, providing views of Lake Palace, Jag Mandir, and City Palace.',
          category: 'Sightseeing',
          duration: 60,
          estimatedCost: 400,
          latitude: 24.5684,
          longitude: 73.6730
        },
        {
          name: 'Sajjangarh Monsoon Palace Sunset Visit',
          description: 'A hilltop palatial residence overlooking the lakes and city of Udaipur. Offers breathtaking panoramic views.',
          category: 'Nature',
          duration: 120,
          estimatedCost: 150,
          latitude: 24.5895,
          longitude: 73.6378
        },
        {
          name: 'Dharohar Folk Dance Show',
          description: 'Watch an energetic evening Rajasthani folk dance and puppet show at the historic Bagore Ki Haveli.',
          category: 'Culture',
          duration: 75,
          estimatedCost: 150,
          latitude: 24.5791,
          longitude: 73.6806
        }
      ]
    }
  },
  {
    name: 'Jaipur',
    country: 'India',
    region: 'Rajasthan',
    description: 'The capital of Rajasthan, known as the "Pink City" for its trademark building color. A hub for historical forts, palaces, and gems.',
    image: 'https://images.unsplash.com/photo-1477584322811-36fa8c13038f?auto=format&fit=crop&w=800&q=80',
    costIndex: 3,
    popularity: 4.7,
    latitude: 26.9124,
    longitude: 75.7873,
    activities: {
      create: [
        {
          name: 'Amber Fort Tour',
          description: 'A massive hilltop fort known for its artistic style elements, including the breathtaking Sheesh Mahal (Mirror Palace).',
          category: 'Sightseeing',
          duration: 150,
          estimatedCost: 200,
          latitude: 26.9855,
          longitude: 75.8513
        },
        {
          name: 'Hawa Mahal Photo Session',
          description: 'The iconic "Palace of Winds" featuring 953 small windows (jharokhas) constructed for royal women to observe daily street life.',
          category: 'Sightseeing',
          duration: 45,
          estimatedCost: 50,
          latitude: 26.9239,
          longitude: 75.8267
        },
        {
          name: 'Authentic Rajasthani Thali at Chokhi Dhani',
          description: 'An ethnic village resort offering traditional folk dances, camel rides, and a massive authentic Rajasthani dining experience.',
          category: 'Food',
          duration: 240,
          estimatedCost: 900,
          latitude: 26.7681,
          longitude: 75.8459
        }
      ]
    }
  },
  {
    name: 'Goa',
    country: 'India',
    region: 'Goa',
    description: 'Famous for its sandy beaches, active nightlife, historic Portuguese-style churches, and delicious seafood curries.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    costIndex: 3,
    popularity: 4.9,
    latitude: 15.2993,
    longitude: 74.1240,
    activities: {
      create: [
        {
          name: 'Scuba Diving & Water Sports',
          description: 'Experience thrill with jet-skiing, parasailing, and a guided scuba dive to see marine life near Grand Island.',
          category: 'Adventure',
          duration: 300,
          estimatedCost: 2500,
          latitude: 15.3524,
          longitude: 73.7607
        },
        {
          name: 'Basilica of Bom Jesus Heritage Tour',
          description: 'UNESCO World Heritage site containing the mortal remains of St. Francis Xavier, highlighting Portuguese colonial architecture.',
          category: 'Culture',
          duration: 90,
          estimatedCost: 0,
          latitude: 15.5009,
          longitude: 73.9116
        },
        {
          name: 'Sunset Dinner Cruise on Mandovi River',
          description: 'A romantic evening boat cruise with music, Goan folk dances, and dinner under the stars.',
          category: 'Nightlife',
          duration: 120,
          estimatedCost: 800,
          latitude: 15.5015,
          longitude: 73.8290
        }
      ]
    }
  },
  {
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    description: 'The global center for art, fashion, gastronomy, and culture. Iconic for its 19th-century cityscape, the Eiffel Tower, and museums.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    costIndex: 5,
    popularity: 4.95,
    latitude: 48.8566,
    longitude: 2.3522,
    activities: {
      create: [
        {
          name: 'Eiffel Tower Summit Access',
          description: 'Climb to the top of Paris\'s iconic tower for unmatched views across the Seine river and the entire city skyline.',
          category: 'Sightseeing',
          duration: 120,
          estimatedCost: 2500,
          latitude: 48.8584,
          longitude: 2.2945
        },
        {
          name: 'Louvre Museum Tour',
          description: 'See the Mona Lisa, Winged Victory of Samothrace, and thousands of historical treasures in the world\'s largest art museum.',
          category: 'Culture',
          duration: 240,
          estimatedCost: 1800,
          latitude: 48.8606,
          longitude: 2.3376
        },
        {
          name: 'Seine River Cruise with Crepe Tasting',
          description: 'A relaxed cruise past historical monuments combined with tasting authentic French sweet crepes.',
          category: 'Food',
          duration: 90,
          estimatedCost: 1200,
          latitude: 48.8615,
          longitude: 2.3245
        }
      ]
    }
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Kanto',
    description: 'A dazzling megacity combining futuristic skyscrapers, bright neon lights, historic Shinto shrines, and world-class sushi bars.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    costIndex: 4,
    popularity: 4.92,
    latitude: 35.6762,
    longitude: 139.6503,
    activities: {
      create: [
        {
          name: 'Shibuya Crossing & Hachiko Visit',
          description: 'Stand at the world\'s busiest pedestrian intersection and pay respects to the legendary loyal dog statue Hachiko.',
          category: 'Sightseeing',
          duration: 60,
          estimatedCost: 0,
          latitude: 35.6580,
          longitude: 139.7016
        },
        {
          name: 'Senso-ji Temple Tour in Asakusa',
          description: 'Tokyo\'s oldest and most iconic Buddhist temple. Stroll down Nakamise shopping street for traditional snacks and charms.',
          category: 'Culture',
          duration: 120,
          estimatedCost: 100,
          latitude: 35.7148,
          longitude: 139.7967
        },
        {
          name: 'Robot Restaurant / Electric Town Tour in Akihabara',
          description: 'Explore the epicenter of electronics, anime, gaming culture, and futuristic themed cafes.',
          category: 'Shopping',
          duration: 180,
          estimatedCost: 500,
          latitude: 35.6997,
          longitude: 139.7715
        }
      ]
    }
  }
];

async function main() {
  console.log('Clearing existing database tables...');
  await prisma.tripActivity.deleteMany({});
  await prisma.tripStop.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.savedDestination.deleteMany({});
  await prisma.packingItem.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.tripMember.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.city.deleteMany({});

  console.log('Seeding cities and activities...');
  for (const cityInfo of citiesData) {
    const createdCity = await prisma.city.create({
      data: cityInfo,
    });
    console.log(`Created city: ${createdCity.name} with ${cityInfo.activities.create.length} activities.`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
