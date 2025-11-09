import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getCharactersList, getCharacters, createCharacter } from '$lib/data/characters';

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
  }
};

