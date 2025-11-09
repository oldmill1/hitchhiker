import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { 
  getCharactersList, 
  getCharacters, 
  getCharacter, 
  getCharacterActions,
  getCharacterVitals 
} from '$lib/data/characters';

export const load: PageLoad = async ({ params }) => {
  const character = getCharacter(params.character);
  
  if (!character) {
    throw error(404, 'Character not found');
  }

  const vitals = getCharacterVitals(params.character);
  
  if (!vitals) {
    throw error(404, 'Vitals not found');
  }

  const charactersList = getCharactersList();
  const characters = getCharacters(params.character);
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

