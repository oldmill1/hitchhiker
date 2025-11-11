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

export interface RelationshipItem {
  id?: string; // Optional for new relationships
  label: string;
  toCharacterName: string;
  toCharacterSlug: string;
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
    include: { 
      relationshipsFrom: {
        include: {
          toCharacter: true
        }
      }
    }
  });

  if (!character) return null;

  return character.relationshipsFrom.map(rel => ({
    name: rel.label,
    value: rel.toCharacter.name
  }));
}

export async function getCharacterRelationshipsWithDetails(slug: string): Promise<RelationshipItem[] | null> {
  const character = await prisma.character.findUnique({
    where: { slug },
    include: { 
      relationshipsFrom: {
        include: {
          toCharacter: true
        }
      }
    }
  });

  if (!character) return null;

  return character.relationshipsFrom.map(rel => ({
    id: rel.id,
    label: rel.label,
    toCharacterName: rel.toCharacter.name,
    toCharacterSlug: rel.toCharacter.slug
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

// Save or update a single vital
export async function saveOrUpdateVital(slug: string, name: string, value: string): Promise<void> {
  const characterId = await getCharacterId(slug);
  if (!characterId) {
    throw new Error(`Character with slug "${slug}" not found`);
  }

  // Find existing vital with same name for this character
  const existingVital = await prisma.vital.findFirst({
    where: {
      characterId,
      name
    }
  });

  if (existingVital) {
    // Update existing vital
    await prisma.vital.update({
      where: { id: existingVital.id },
      data: { value }
    });
  } else {
    // Create new vital
    await prisma.vital.create({
      data: {
        characterId,
        name,
        value
      }
    });
  }
}

// Update character name
export async function updateCharacterName(slug: string, name: string): Promise<void> {
  await prisma.character.update({
    where: { slug },
    data: { name }
  });
}

// Delete a vital by name
export async function deleteVital(slug: string, name: string): Promise<void> {
  const characterId = await getCharacterId(slug);
  if (!characterId) {
    throw new Error(`Character with slug "${slug}" not found`);
  }

  // Find and delete the vital with the given name for this character
  const vital = await prisma.vital.findFirst({
    where: {
      characterId,
      name
    }
  });

  if (vital) {
    await prisma.vital.delete({
      where: { id: vital.id }
    });
  }
}

// Get all characters except the current one for dropdown
export async function getAllCharactersExceptCurrent(currentSlug: string): Promise<Array<{ name: string; slug: string }>> {
  const characters = await prisma.character.findMany({
    where: {
      slug: { not: currentSlug }
    },
    orderBy: { name: 'asc' },
    select: {
      name: true,
      slug: true
    }
  });

  return characters;
}

// Save or update a relationship
export async function saveOrUpdateRelationship(
  fromCharacterSlug: string,
  relationshipId: string | null,
  label: string,
  toCharacterSlug: string
): Promise<string> {
  const fromCharacterId = await getCharacterId(fromCharacterSlug);
  if (!fromCharacterId) {
    throw new Error(`Character with slug "${fromCharacterSlug}" not found`);
  }

  const toCharacterId = await getCharacterId(toCharacterSlug);
  if (!toCharacterId) {
    throw new Error(`Character with slug "${toCharacterSlug}" not found`);
  }

  if (relationshipId) {
    // Update existing relationship
    await prisma.relationship.update({
      where: { id: relationshipId },
      data: {
        label,
        toCharacterId
      }
    });
    return relationshipId;
  } else {
    // Create new relationship
    const relationship = await prisma.relationship.create({
      data: {
        fromCharacterId,
        toCharacterId,
        label
      }
    });
    return relationship.id;
  }
}

// Delete a relationship by ID
export async function deleteRelationship(relationshipId: string): Promise<void> {
  await prisma.relationship.delete({
    where: { id: relationshipId }
  });
}

