import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { extractCharacterSlug } from './selectedCharacter';

/**
 * Global store for multiple selected character slugs.
 * Uses a Set to track which characters are selected.
 */
export const multipleSelections = writable<Set<string>>(new Set());

/**
 * Add a character to the multiple selections
 * @param slug - Character slug to add
 */
export function addSelection(slug: string): void {
  multipleSelections.update((selections) => {
    const newSelections = new Set(selections);
    newSelections.add(slug);
    if (browser) {
      console.log('[multipleSelections] Added:', slug);
    }
    return newSelections;
  });
}

/**
 * Remove a character from the multiple selections
 * @param slug - Character slug to remove
 */
export function removeSelection(slug: string): void {
  multipleSelections.update((selections) => {
    const newSelections = new Set(selections);
    newSelections.delete(slug);
    if (browser) {
      console.log('[multipleSelections] Removed:', slug);
    }
    return newSelections;
  });
}

/**
 * Set multiple selections from an array of slugs
 * @param slugs - Array of character slugs to set
 */
export function setSelections(slugs: string[]): void {
  const newSelections = new Set(slugs);
  if (browser) {
    console.log('[multipleSelections] Set selections:', Array.from(newSelections));
  }
  multipleSelections.set(newSelections);
}

/**
 * Clear all multiple selections
 */
export function clearSelections(): void {
  if (browser) {
    console.log('[multipleSelections] Cleared all selections');
  }
  multipleSelections.set(new Set());
}

/**
 * Check if a character is in the multiple selections
 * @param slug - Character slug to check
 * @returns true if the character is selected
 */
export function isSelected(slug: string): boolean {
  let result = false;
  multipleSelections.subscribe((selections) => {
    result = selections.has(slug);
  })();
  return result;
}

// Log all state changes
if (browser) {
  multipleSelections.subscribe((selections) => {
    console.log('[multipleSelections] State changed:', Array.from(selections));
  });
}

