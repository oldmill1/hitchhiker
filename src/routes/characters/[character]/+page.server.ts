import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getCharactersList, getCharacters, getCharacter, getCharacterActions, getCharacterId, deleteCharacter } from '$lib/data/characters';

export const load: PageServerLoad = async ({ params }) => {
  const character = await getCharacter(params.character);
  
  if (!character) {
    throw error(404, 'Character not found');
  }

  const charactersList = getCharactersList();
  const characters = await getCharacters(params.character);
  const actions = getCharacterActions(params.character);
  
  console.log(`[/characters/${params.character}] Fetched data:`, {
    charactersList,
    characters,
    actions,
    character
  });

  return {
    charactersList,
    characters,
    actions,
    character
  };
};

export const actions: Actions = {
  delete: async ({ params }) => {
    const characterId = await getCharacterId(params.character);
    
    if (!characterId) {
      return fail(404, { error: 'Character not found' });
    }

    try {
      await deleteCharacter(characterId);
      throw redirect(303, '/characters');
    } catch (err) {
      // Re-throw redirect
      if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
        throw err;
      }
      console.error('Error deleting character:', err);
      return fail(500, { error: 'Failed to delete character' });
    }
  }
};

