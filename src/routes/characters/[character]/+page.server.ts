import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCharactersList, getCharacters, getCharacter, getCharacterActions } from '$lib/data/characters';

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

