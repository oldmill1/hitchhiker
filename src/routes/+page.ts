import type { PageLoad } from './$types';
import { getHomepageNavigationItems } from '$lib/data/characters';

export const load: PageLoad = async () => {
  const homepageNavigationItems = getHomepageNavigationItems();
  
  console.log('[/] Fetched data:', {
    homepageNavigationItems
  });
  
  return {
    homepageNavigationItems
  };
};

