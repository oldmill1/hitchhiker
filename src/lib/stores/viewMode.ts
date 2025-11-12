import { writable } from 'svelte/store';

export type ViewMode = 'column' | 'visualizer';

/**
 * Global store for the current view mode.
 * Persists across navigation.
 */
export const viewMode = writable<ViewMode>('visualizer');

/**
 * Set the view mode
 * @param mode - The view mode to set ('column' | 'visualizer')
 */
export function setViewMode(mode: ViewMode): void {
  viewMode.set(mode);
}

/**
 * Toggle between column and visualizer modes
 */
export function toggleViewMode(): void {
  viewMode.update((current) => {
    return current === 'column' ? 'visualizer' : 'column';
  });
}

