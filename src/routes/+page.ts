import type { PageLoad } from './$types';
import { getCharactersList } from '$lib/data/characters';

export const load: PageLoad = async () => {
  const charactersList = getCharactersList();
  
  console.log('[/] Fetched data:', {
    charactersList
  });
  
  return {
    charactersList
  };
};

