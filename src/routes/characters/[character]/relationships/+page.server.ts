import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { 
  getCharactersList, 
  getCharacters, 
  getCharacter, 
  getCharacterActions,
  getCharacterRelationships 
} from '$lib/data/characters';

export const load: PageServerLoad = async ({ params }) => {
  const character = await getCharacter(params.character);
  
  if (!character) {
    throw error(404, 'Character not found');
  }

  const relationships = await getCharacterRelationships(params.character);
  
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

