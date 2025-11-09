import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getCharactersList, getCharacters, getCharacter, getCharacterActions } from '$lib/data/characters';

export const load: PageLoad = async ({ params }) => {
  const character = getCharacter(params.character);
  
  if (!character) {
    throw error(404, 'Character not found');
  }

  const charactersList = getCharactersList();
  const characters = getCharacters(params.character);
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

