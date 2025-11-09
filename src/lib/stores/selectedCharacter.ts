import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Global store for the currently selected character slug.
 * null means no character is selected.
 */
export const selectedCharacter = writable<string | null>(null);

/**
 * Helper function to extract character slug from a URL path
 * @param url - URL path like '/characters/hermione-granger' or '/characters/hermione-granger/vitals'
 * @returns character slug or null if not a character URL
 */
export function extractCharacterSlug(url: string): string | null {
  const match = url.match(/^\/characters\/([^\/]+)/);
  return match ? match[1] : null;
}

/**
 * Set the selected character from a URL
 * @param url - URL path to extract slug from
 */
export function setSelectedCharacterFromUrl(url: string): void {
  const slug = extractCharacterSlug(url);
  if (browser) {
    console.log('[selectedCharacter] URL sync:', { url, slug });
  }
  selectedCharacter.set(slug);
}

// Log all state changes
if (browser) {
  selectedCharacter.subscribe((slug) => {
    console.log('[selectedCharacter] State changed:', slug || '(no selection)');
  });
}

