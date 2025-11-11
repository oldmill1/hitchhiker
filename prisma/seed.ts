import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.vital.deleteMany();
  await prisma.character.deleteMany();

  // Character data
  const charactersData = [
    { name: 'Harry Potter', slug: 'harry-potter', starred: true },
    { name: 'Hermione Granger', slug: 'hermione-granger' },
    { name: 'Ron Weasley', slug: 'ron-weasley' },
    { name: 'Draco Malfoy', slug: 'draco-malfoy', selected: true },
    { name: 'Luna Lovegood', slug: 'luna-lovegood' }
  ];

  // Vitals data
  const vitalsData: Record<string, Array<{ name: string; value: string }>> = {
    'harry-potter': [
      { name: 'Name', value: 'Harry James Potter' },
      { name: 'Born', value: '31 July 1980' },
      { name: 'Blood Status', value: 'Half-blood' },
      { name: 'House', value: 'Gryffindor' }
    ],
    'hermione-granger': [
      { name: 'Name', value: 'Hermione Jean Granger' },
      { name: 'Born', value: '19 September 1979' },
      { name: 'Blood Status', value: 'Muggle-born' },
      { name: 'House', value: 'Gryffindor' }
    ],
    'ron-weasley': [
      { name: 'Name', value: 'Ronald Bilius Weasley' },
      { name: 'Born', value: '1 March 1980' },
      { name: 'Blood Status', value: 'Pure-blood' },
      { name: 'House', value: 'Gryffindor' }
    ],
    'draco-malfoy': [
      { name: 'Name', value: 'Draco Lucius Malfoy' },
      { name: 'Born', value: '5 June 1980' },
      { name: 'Blood Status', value: 'Pure-blood' },
      { name: 'House', value: 'Slytherin' }
    ],
    'luna-lovegood': [
      { name: 'Name', value: 'Luna Lovegood' },
      { name: 'Born', value: '13 February 1981' },
      { name: 'Blood Status', value: 'Pure-blood' },
      { name: 'House', value: 'Ravenclaw' }
    ]
  };

  // Create characters and their related data
  for (const charData of charactersData) {
    const character = await prisma.character.create({
      data: {
        name: charData.name,
        slug: charData.slug,
        starred: charData.starred || false,
        selected: charData.selected || false,
        vitals: {
          create: vitalsData[charData.slug] || []
        }
      }
    });

    console.log(`✅ Created character: ${character.name}`);
  }

  console.log('✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

