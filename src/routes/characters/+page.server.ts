import type { PageServerLoad } from './$types';
import { getCharactersList, getCharacters } from '$lib/data/characters';

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

