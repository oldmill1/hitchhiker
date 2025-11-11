import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { 
  getCharactersList, 
  getCharacters, 
  getCharacter, 
  getCharacterActions,
  getCharacterRelationships,
  getCharacterRelationshipsWithDetails,
  getAllCharactersExceptCurrent,
  saveOrUpdateRelationship,
  deleteRelationship
} from '$lib/data/characters';

export const load: PageServerLoad = async ({ params }) => {
  const character = await getCharacter(params.character);
  
  if (!character) {
    throw error(404, 'Character not found');
  }

  const relationships = await getCharacterRelationships(params.character);
  const relationshipsWithDetails = await getCharacterRelationshipsWithDetails(params.character);
  const availableCharacters = await getAllCharactersExceptCurrent(params.character);
  
  if (!relationships) {
    throw error(404, 'Relationships not found');
  }

  const charactersList = getCharactersList();
  const characters = await getCharacters(params.character);
  const actions = getCharacterActions(params.character, 'relationships');
  
  console.log(`[/characters/${params.character}/relationships] Fetched data:`, {
    charactersList,
    characters,
    actions,
    relationships,
    relationshipsWithDetails,
    availableCharacters,
    character
  });

  return {
    charactersList,
    characters,
    actions,
    relationships,
    relationshipsWithDetails: relationshipsWithDetails || [],
    availableCharacters,
    character
  };
};

export const actions: Actions = {
  saveRelationship: async ({ request, params }) => {
    const formData = await request.formData();
    const relationshipId = formData.get('relationshipId')?.toString().trim() || null;
    const label = formData.get('label')?.toString().trim();
    const toCharacterSlug = formData.get('toCharacterSlug')?.toString().trim();

    if (!label) {
      return fail(400, { error: 'Relationship label is required' });
    }

    if (!toCharacterSlug) {
      return fail(400, { error: 'Character selection is required' });
    }

    try {
      const savedRelationshipId = await saveOrUpdateRelationship(params.character, relationshipId, label, toCharacterSlug);
      return { success: true, relationshipId: savedRelationshipId };
    } catch (err) {
      console.error('Error saving relationship:', err);
      return fail(500, { error: 'Failed to save relationship' });
    }
  },

  deleteRelationship: async ({ request, params }) => {
    const formData = await request.formData();
    const relationshipId = formData.get('relationshipId')?.toString().trim();

    if (!relationshipId) {
      return fail(400, { error: 'Relationship ID is required' });
    }

    try {
      await deleteRelationship(relationshipId);
      return { success: true };
    } catch (err) {
      console.error('Error deleting relationship:', err);
      return fail(500, { error: 'Failed to delete relationship' });
    }
  }
};

