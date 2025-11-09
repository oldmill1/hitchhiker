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

  return {
    charactersList: getCharactersList(),
    characters: getCharacters(params.character),
    actions: getCharacterActions(params.character, 'vitals'),
    vitals,
    character
  };
};

