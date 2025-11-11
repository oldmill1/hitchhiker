import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { 
  getCharactersList, 
  getCharacters, 
  getCharacter, 
  getCharacterActions,
  getCharacterVitals,
  saveOrUpdateVital,
  updateCharacterName
} from '$lib/data/characters';

export const load: PageServerLoad = async ({ params }) => {
  const character = await getCharacter(params.character);
  
  if (!character) {
    throw error(404, 'Character not found');
  }

  const vitals = await getCharacterVitals(params.character);
  
  // Allow empty arrays (new characters won't have vitals yet)
  // Only throw error if vitals is null (character doesn't exist)
  if (vitals === null) {
    throw error(404, 'Vitals not found');
  }

  const charactersList = getCharactersList();
  const characters = await getCharacters(params.character);
  const actions = getCharacterActions(params.character, 'vitals');
  
  console.log(`[/characters/${params.character}/vitals] Fetched data:`, {
    charactersList,
    characters,
    actions,
    vitals,
    character
  });

  return {
    charactersList,
    characters,
    actions,
    vitals,
    character
  };
};

export const actions: Actions = {
  saveVital: async ({ request, params }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();
    const value = formData.get('value')?.toString().trim() || '';

    if (!name) {
      return fail(400, { error: 'Vital name is required' });
    }

    try {
      await saveOrUpdateVital(params.character, name, value);
      return { success: true };
    } catch (err) {
      console.error('Error saving vital:', err);
      return fail(500, { error: 'Failed to save vital' });
    }
  },

  updateCharacterName: async ({ request, params }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();

    if (!name) {
      return fail(400, { error: 'Character name is required' });
    }

    try {
      await updateCharacterName(params.character, name);
      return { success: true };
    } catch (err) {
      console.error('Error updating character name:', err);
      return fail(500, { error: 'Failed to update character name' });
    }
  }
};

