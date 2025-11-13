<script lang="ts">
  import styles from './Visualizer.module.scss';
  import type { ListItem } from '$lib/data/characters';
  import { DesktopIcon } from '$lib';
  import { page } from '$app/stores';

  interface Props {
    navigationItems?: ListItem[] | null;
    characters?: ListItem[] | null;
    actions?: ListItem[] | null;
  }

  let { navigationItems, characters, actions }: Props = $props();

  // Determine which items to display based on the current URL pathname
  const itemsToDisplay = $derived.by(() => {
    const pathname = $page.url.pathname;
    
    // If on character detail page (/characters/[slug]), show actions
    if (pathname.startsWith('/characters/') && pathname !== '/characters') {
      return actions ?? null;
    }
    
    // If on /characters, show characters
    if (pathname === '/characters') {
      return characters ?? null;
    }
    
    // If on root (/), show navigationItems
    if (pathname === '/') {
      return navigationItems ?? null;
    }
    
    // Fallback to null if no match
    return null;
  });
</script>

<div class={styles.visualizer}>
  {#if itemsToDisplay}
    <div class={styles.grid}>
      {#each itemsToDisplay as item}
        <DesktopIcon label={item.content} link={item.link} />
      {/each}
    </div>
  {/if}
</div>

