import type { PageLoad } from './$types';
import { getHomepageNavigationItems } from '$lib/data/characters';

export const load: PageLoad = async () => {
  const charactersList = getHomepageNavigationItems();
  
  console.log('[/] Fetched data:', {
    charactersList
  });
  
  return {
    charactersList
  };
};

