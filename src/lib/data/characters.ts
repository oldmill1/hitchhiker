import { prisma } from '$lib/db/prisma';

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

// Database functions
export async function getCharacters(currentCharacterSlug?: string): Promise<ListItem[]> {
  const characters = await prisma.character.findMany({
    orderBy: { name: 'asc' }
  });

  return characters.map(char => ({
    content: char.name,
    link: `/characters/${char.slug}`,
    starred: char.starred,
    selected: currentCharacterSlug === char.slug
  }));
}

export async function getCharacter(slug: string): Promise<Character | null> {
  const character = await prisma.character.findUnique({
    where: { slug }
  });

  if (!character) return null;

  return {
    name: character.name,
    slug: character.slug,
    starred: character.starred,
    selected: character.selected
  };
}

export async function getCharacterVitals(slug: string): Promise<PropItem[] | null> {
  const character = await prisma.character.findUnique({
    where: { slug },
    include: { vitals: true }
  });

  if (!character) return null;

  return character.vitals.map(vital => ({
    name: vital.name,
    value: vital.value
  }));
}

export async function getCharacterRelationships(slug: string): Promise<PropItem[] | null> {
  const character = await prisma.character.findUnique({
    where: { slug },
    include: { relationships: true }
  });

  if (!character) return null;

  return character.relationships.map(rel => ({
    name: rel.name,
    value: rel.value
  }));
}

// Static helper functions (no database needed)
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

// Slug generation utility
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Create character with duplicate slug handling
export async function createCharacter(name: string): Promise<string> {
  const baseSlug = generateSlug(name);
  
  // Check if base slug exists and find available slug
  let slug = baseSlug;
  let counter = 2;
  
  while (await prisma.character.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  // Create the character
  await prisma.character.create({
    data: {
      name,
      slug
    }
  });
  
  return slug;
}

// Get character ID from slug
export async function getCharacterId(slug: string): Promise<string | null> {
  const character = await prisma.character.findUnique({
    where: { slug },
    select: { id: true }
  });

  return character?.id ?? null;
}

// Delete character by ID
export async function deleteCharacter(id: string): Promise<void> {
  await prisma.character.delete({
    where: { id }
  });
}

