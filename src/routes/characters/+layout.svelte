<script lang="ts">
  import { page } from '$app/stores';
  import { setSelectedCharacterFromUrl } from '$lib/stores/selectedCharacter';
  import { browser } from '$app/environment';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  // Sync store with URL whenever the page URL changes
  $effect(() => {
    const pathname = $page.url.pathname;
    if (browser) {
      console.log('[selectedCharacter] Layout: Syncing with URL:', pathname);
    }
    setSelectedCharacterFromUrl(pathname);
  });
</script>

{@render children()}

