import type { PageLoad } from './$types';
import { getCharactersList } from '$lib/data/characters';

export const load: PageLoad = async () => {
  return {
    charactersList: getCharactersList()
  };
};

