import type { PageLoad } from './$types';
import { getCharactersList, getCharacters } from '$lib/data/characters';

export const load: PageLoad = async () => {
  return {
    charactersList: getCharactersList(true),
    characters: getCharacters()
  };
};

