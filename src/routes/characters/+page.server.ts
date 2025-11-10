import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getCharactersList, getCharacters, createCharacter, getCharacterId, deleteCharacter } from '$lib/data/characters';

export const load: PageServerLoad = async () => {
  const charactersList = getCharactersList(true);
  const characters = await getCharacters();
  
  console.log('[/characters] Fetched data:', {
    charactersList,
    characters
  });
  
  return {
    charactersList,
    characters
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();

    // Validate form data
    if (!name || name.length === 0) {
      return fail(400, { error: 'Character name is required' });
    }

    try {
      const slug = await createCharacter(name);
      // Redirect to the vitals page after successful creation
      throw redirect(303, `/characters/${slug}/vitals`);
    } catch (error) {
      // If it's a redirect, re-throw it
      if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
        throw error;
      }
      console.error('Error creating character:', error);
      return fail(500, { error: 'Failed to create character' });
    }
  },
  deleteMultiple: async ({ request }) => {
    const formData = await request.formData();
    const slugsString = formData.get('slugs')?.toString();

    if (!slugsString) {
      return fail(400, { error: 'No characters specified for deletion' });
    }

    try {
      // Parse the slugs array from the form data
      const slugs = JSON.parse(slugsString) as string[];
      
      if (!Array.isArray(slugs) || slugs.length === 0) {
        return fail(400, { error: 'Invalid slugs array' });
      }

      // Convert slugs to IDs and delete each character
      for (const slug of slugs) {
        const characterId = await getCharacterId(slug);
        if (characterId) {
          await deleteCharacter(characterId);
        }
      }

      // Redirect to /characters after successful deletion
      throw redirect(303, '/characters');
    } catch (error) {
      // If it's a redirect, re-throw it
      if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
        throw error;
      }
      console.error('Error deleting characters:', error);
      return fail(500, { error: 'Failed to delete characters' });
    }
  }
};

