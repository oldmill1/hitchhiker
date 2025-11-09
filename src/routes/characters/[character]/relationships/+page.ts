import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { 
  getCharactersList, 
  getCharacters, 
  getCharacter, 
  getCharacterActions,
  getCharacterRelationships 
} from '$lib/data/characters';

export const load: PageLoad = async ({ params }) => {
  const character = getCharacter(params.character);
  
  if (!character) {
    throw error(404, 'Character not found');
  }

  const relationships = getCharacterRelationships(params.character);
  
  if (!relationships) {
    throw error(404, 'Relationships not found');
  }

  const charactersList = getCharactersList();
  const characters = getCharacters(params.character);
  const actions = getCharacterActions(params.character, 'relationships');
  
  console.log(`[/characters/${params.character}/relationships] Fetched data:`, {
    charactersList,
    characters,
    actions,
    relationships,
    character
  });

  return {
    charactersList,
    characters,
    actions,
    relationships,
    character
  };
};

