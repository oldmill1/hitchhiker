# Data Fetching Guide

## Overview

This project uses SvelteKit's file-based routing system with a data fetching pattern where each route has a `+page.ts` loader file that fetches data, which is then passed to the corresponding `+page.svelte` component.

## Core Concept: `+page.ts` is the Loader for `+page.svelte`

### The Relationship

- **`+page.ts`** = The data loader/fetcher
  - Exports a `load` function that runs before the page renders
  - Fetches and prepares all data needed for the page
  - Returns an object that becomes the `data` prop

- **`+page.svelte`** = The page component
  - Receives data from `+page.ts` via the `data` prop
  - Renders the UI using that data
  - Automatically typed based on what `load` returns

### The Flow

```
User navigates to a route
         ↓
SvelteKit finds matching +page.ts
         ↓
Calls the load() function
         ↓
load() fetches data and returns an object
         ↓
SvelteKit passes returned data to +page.svelte
         ↓
+page.svelte receives it as: let { data } = $props()
         ↓
Component renders using data.* properties
```

## Example: Character Detail Route

### The Loader (`src/routes/characters/[character]/+page.ts`)

```typescript
export const load: PageLoad = async ({ params }) => {
  // Fetch all required data
  const character = getCharacter(params.character);
  const charactersList = getCharactersList();
  const characters = getCharacters(params.character);
  const actions = getCharacterActions(params.character);
  
  // Return data object
  return {
    charactersList,  // ← Becomes data.charactersList
    characters,      // ← Becomes data.characters
    actions,         // ← Becomes data.actions
    character        // ← Becomes data.character
  };
};
```

### The Component (`src/routes/characters/[character]/+page.svelte`)

```svelte
<script lang="ts">
  import type { PageData } from './$types';
  
  // data prop automatically contains what load() returned
  let { data }: { data: PageData } = $props();
</script>

<!-- Use the data from the loader -->
<ColumnLayout 
  column1={data.charactersList}  // From load() return
  column2={data.characters}       // From load() return
  column3={data.actions}         // From load() return
/>
```

## Route Structure

Each route follows this pattern:

```
src/routes/
  +page.ts              ← Loader for root route
  +page.svelte          ← Component for root route
  characters/
    +page.ts            ← Loader for /characters
    +page.svelte         ← Component for /characters
    [character]/
      +page.ts          ← Loader for /characters/[character]
      +page.svelte       ← Component for /characters/[character]
      vitals/
        +page.ts        ← Loader for /characters/[character]/vitals
        +page.svelte     ← Component for /characters/[character]/vitals
```

## Data Fetching Examples

### Root Route (`/`)

**Loader** (`src/routes/+page.ts`):
```typescript
export const load: PageLoad = async () => {
  const charactersList = getCharactersList();
  return { charactersList };
};
```

**Component** (`src/routes/+page.svelte`):
```svelte
<ColumnLayout column1={data.charactersList} />
```

### Characters List Route (`/characters`)

**Loader** (`src/routes/characters/+page.ts`):
```typescript
export const load: PageLoad = async () => {
  const charactersList = getCharactersList(true);
  const characters = getCharacters();
  return { charactersList, characters };
};
```

**Component** (`src/routes/characters/+page.svelte`):
```svelte
<ColumnLayout 
  column1={data.charactersList} 
  column2={data.characters} 
/>
```

### Character Detail Route (`/characters/[character]`)

**Loader** (`src/routes/characters/[character]/+page.ts`):
```typescript
export const load: PageLoad = async ({ params }) => {
  const character = getCharacter(params.character);
  if (!character) throw error(404, 'Character not found');
  
  return {
    charactersList: getCharactersList(),
    characters: getCharacters(params.character),
    actions: getCharacterActions(params.character),
    character
  };
};
```

**Component** (`src/routes/characters/[character]/+page.svelte`):
```svelte
<ColumnLayout 
  column1={data.charactersList} 
  column2={data.characters} 
  column3={data.actions}
/>
```

## Key Features

### 1. Automatic Prefetching

SvelteKit automatically prefetches data when you hover over links. This means:
- The `load` function runs on hover (not just on click)
- Data is ready instantly when you click
- Console logs will show data being fetched on hover

### 2. Route Parameters

Dynamic route segments (like `[character]`) are available in the `load` function via `params`:

```typescript
export const load: PageLoad = async ({ params }) => {
  // params.character = 'draco-malfoy' (from URL)
  const character = getCharacter(params.character);
  // ...
};
```

### 3. Type Safety

SvelteKit automatically generates TypeScript types:
- `PageData` type is generated from what `load` returns
- `PageLoad` type ensures correct function signature
- Import from `./$types` for type safety

### 4. Error Handling

You can throw errors in load functions:

```typescript
if (!character) {
  throw error(404, 'Character not found');
}
```

SvelteKit will automatically show the error page.

## When Data is Fetched

1. **On Navigation**: When user clicks a link or navigates to a route
2. **On Prefetch**: When user hovers over a link (default behavior)
3. **On Page Load**: When the page first loads
4. **On Route Change**: When navigating between routes

## Best Practices

1. **Fetch all data in `+page.ts`**: Don't fetch data in components, do it in loaders
2. **Return structured data**: Return objects with clear property names
3. **Handle errors**: Check for missing data and throw appropriate errors
4. **Use console.log for debugging**: Log fetched data to understand the flow
5. **Keep loaders focused**: Each loader should only fetch data for its specific route

## Data Flow Summary

```
+page.ts (loader)
  ↓ returns object
SvelteKit routing system
  ↓ passes as data prop
+page.svelte (component)
  ↓ uses data.*
UI renders with data
```

## Debugging

To see what data is being fetched, check the console logs in each `+page.ts` file. The logs show:
- Which route is being loaded
- What data is being fetched
- The structure of the returned data

Example console output:
```
[/characters/draco-malfoy] Fetched data: {
  charactersList: Array(1),
  characters: Array(5),
  actions: Array(2),
  character: { name: 'Draco Malfoy', slug: 'draco-malfoy' }
}
```

## Migration from Hardcoded to API

Currently, data is hardcoded in `src/lib/data/characters.ts`. To migrate to real API calls:

1. Replace hardcoded functions with API calls in `+page.ts`:
   ```typescript
   // Before (hardcoded)
   const characters = getCharacters();
   
   // After (API call)
   const response = await fetch('/api/characters');
   const characters = await response.json();
   ```

2. The component code (`+page.svelte`) doesn't need to change - it still receives `data` the same way

3. The data structure should remain the same for consistency

## Additional Resources

- [SvelteKit Documentation - Loading Data](https://kit.svelte.dev/docs/load)
- [SvelteKit Documentation - Routing](https://kit.svelte.dev/docs/routing)

