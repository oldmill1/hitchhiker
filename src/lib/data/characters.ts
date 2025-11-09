export interface Character {
  name: string;
  slug: string;
  starred?: boolean;
  selected?: boolean;
}

export interface PropItem {
  name: string;
  value: string;
}

export interface ListItem {
  content: string;
  link?: string;
  starred?: boolean;
  selected?: boolean;
}

// Hardcoded character data
const charactersData: Character[] = [
  { name: 'Harry Potter', slug: 'harry-potter', starred: true },
  { name: 'Hermione Granger', slug: 'hermione-granger' },
  { name: 'Ron Weasley', slug: 'ron-weasley' },
  { name: 'Draco Malfoy', slug: 'draco-malfoy', selected: true },
  { name: 'Luna Lovegood', slug: 'luna-lovegood' }
];

// Character vitals data
const vitalsData: Record<string, PropItem[]> = {
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

// Character relationships data
const relationshipsData: Record<string, PropItem[]> = {
  'harry-potter': [
    { name: 'Best Friend', value: 'Ron Weasley' },
    { name: 'Best Friend', value: 'Hermione Granger' },
    { name: 'Godfather', value: 'Sirius Black' },
    { name: 'Mentor', value: 'Albus Dumbledore' }
  ],
  'hermione-granger': [
    { name: 'Best Friend', value: 'Harry Potter' },
    { name: 'Best Friend', value: 'Ron Weasley' },
    { name: 'Boyfriend', value: 'Ron Weasley' }
  ],
  'ron-weasley': [
    { name: 'Best Friend', value: 'Harry Potter' },
    { name: 'Best Friend', value: 'Hermione Granger' },
    { name: 'Girlfriend', value: 'Hermione Granger' },
    { name: 'Family', value: 'Weasley Family' }
  ],
  'draco-malfoy': [
    { name: 'Father', value: 'Lucius Malfoy' },
    { name: 'Mother', value: 'Narcissa Malfoy' },
    { name: 'Friend', value: 'Vincent Crabbe' },
    { name: 'Friend', value: 'Gregory Goyle' }
  ],
  'luna-lovegood': [
    { name: 'Father', value: 'Xenophilius Lovegood' },
    { name: 'Friend', value: 'Harry Potter' },
    { name: 'Friend', value: 'Neville Longbottom' }
  ]
};

// Helper functions
export function getCharacters(currentCharacterSlug?: string): ListItem[] {
  return charactersData.map(char => ({
    content: char.name,
    link: `/characters/${char.slug}`,
    starred: char.starred,
    selected: currentCharacterSlug === char.slug
  }));
}

export function getCharacter(slug: string): Character | null {
  return charactersData.find(char => char.slug === slug) || null;
}

export function getCharacterVitals(slug: string): PropItem[] | null {
  return vitalsData[slug] || null;
}

export function getCharacterRelationships(slug: string): PropItem[] | null {
  return relationshipsData[slug] || null;
}

export function getCharacterActions(slug: string, currentAction?: 'vitals' | 'relationships'): ListItem[] {
  return [
    { 
      content: 'Vitals', 
      link: `/characters/${slug}/vitals`,
      selected: currentAction === 'vitals'
    },
    { 
      content: 'Relationships', 
      link: `/characters/${slug}/relationships`,
      selected: currentAction === 'relationships'
    }
  ];
}

export function getCharactersList(selected: boolean = false): ListItem[] {
  return [
    { content: 'Characters', link: '/characters', selected }
  ];
}

