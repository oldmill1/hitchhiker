<script lang="ts">
  import styles from './Visualizer.module.scss';
  import type { ListItem, PropItem, RelationshipItem } from '$lib/data/characters';
  import { DesktopIcon, VitalCard } from '$lib';
  import { page } from '$app/stores';

  interface Props {
    navigationItems?: ListItem[] | null;
    characters?: ListItem[] | null;
    actions?: ListItem[] | null;
    vitals?: PropItem[] | null;
    relationshipsWithDetails?: RelationshipItem[] | null;
    characterName?: string;
  }

  let { navigationItems, characters, actions, vitals, relationshipsWithDetails, characterName }: Props = $props();

  // Check if we're displaying vitals (for card layout vs icon grid)
  const isVitalsView = $derived.by(() => {
    const pathname = $page.url.pathname;
    return pathname.endsWith('/vitals') && pathname.startsWith('/characters/');
  });

  // Check if we're displaying relationships (for text list view)
  const isRelationshipsView = $derived.by(() => {
    const pathname = $page.url.pathname;
    return pathname.endsWith('/relationships') && pathname.startsWith('/characters/');
  });

  // Determine which items to display based on the current URL pathname
  const itemsToDisplay = $derived.by(() => {
    const pathname = $page.url.pathname;
    
    // If on vitals page (/characters/[slug]/vitals), show vitals
    if (isVitalsView) {
      return vitals ?? null;
    }
    
    // If on relationships page (/characters/[slug]/relationships), skip (handled separately)
    if (isRelationshipsView) {
      return null;
    }
    
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

  // Separate vitals for type safety
  const vitalsToDisplay = $derived(isVitalsView ? (vitals ?? null) : null);
  
  // List items for icon grid (navigationItems, characters, actions)
  const listItemsToDisplay = $derived(
    isVitalsView || isRelationshipsView ? null : (itemsToDisplay as ListItem[] | null)
  );

  // Relationships to display
  const relationshipsToDisplay = $derived(
    isRelationshipsView ? (relationshipsWithDetails ?? null) : null
  );
</script>

<div class={styles.visualizer}>
  {#if isVitalsView && vitalsToDisplay}
    <!-- Card-based layout for vitals -->
    <div class={styles.vitalsGrid}>
      {#each vitalsToDisplay as vital}
        <VitalCard name={vital.name} value={vital.value} />
      {/each}
    </div>
  {:else if isRelationshipsView && relationshipsToDisplay}
    <!-- Text list view for relationships -->
    <div class={styles.relationshipsList}>
      {#each relationshipsToDisplay as relationship}
        <div class={styles.relationshipItem}>
          <span class={styles.relationshipLabel}>{relationship.label}:</span>
          <span class={styles.relationshipName}>{relationship.toCharacterName}</span>
        </div>
      {/each}
    </div>
  {:else if listItemsToDisplay}
    <!-- Icon grid for navigation items, characters, and actions -->
    <div class={styles.grid}>
      {#each listItemsToDisplay as item}
        <DesktopIcon label={item.content} link={item.link} />
      {/each}
    </div>
  {/if}
</div>

