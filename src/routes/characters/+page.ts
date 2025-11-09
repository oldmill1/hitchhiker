import type { PageLoad } from './$types';
import { getCharactersList, getCharacters } from '$lib/data/characters';

export const load: PageLoad = async () => {
  const charactersList = getCharactersList(true);
  const characters = getCharacters();
  
  console.log('[/characters] Fetched data:', {
    charactersList,
    characters
  });
  
  return {
    charactersList,
    characters
  };
};

