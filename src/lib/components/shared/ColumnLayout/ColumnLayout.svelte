<script lang="ts">
  import styles from './ColumnLayout.module.scss';
  import { List, Infoscreen } from '$lib';
  import type { ListItem, PropItem } from '$lib/data/characters';
  import type { Snippet } from 'svelte';

  interface Props {
    navigationItems?: ListItem[] | null;
    characters?: ListItem[] | null;
    actions?: ListItem[] | null;
    details?: PropItem[] | null;
    detailsContent?: Snippet;
    navigationItemsHeader?: Snippet;
  }

  let { navigationItems, characters, actions, details, detailsContent, navigationItemsHeader }: Props = $props();
</script>

<div class={styles.container}>
  <div class={styles.column}>
    {#if navigationItems}
      <List items={navigationItems} header={navigationItemsHeader} />
    {/if}
  </div>
  <div class={styles.column}>
    {#if characters}
      <List items={characters} />
    {/if}
  </div>
  <div class={styles.column}>
    {#if actions}
      <List items={actions} />
    {/if}
  </div>
  <div class={styles.doubleColumn}>
    {#if detailsContent}
      {@render detailsContent()}
    {:else if details}
      <Infoscreen items={details} />
    {/if}
  </div>
</div>

