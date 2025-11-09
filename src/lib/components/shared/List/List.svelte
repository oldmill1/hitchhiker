<script lang="ts">
  import styles from './List.module.scss';
  import { Text } from '$lib';
  import type { Snippet } from 'svelte';
  import { selectedCharacter, extractCharacterSlug } from '$lib/stores/selectedCharacter';

  interface ListItem {
    content: string;
    link?: string;
    starred?: boolean;
    selected?: boolean;
  }

  interface Props {
    items: ListItem[];
    header?: Snippet;
  }

  let { items, header }: Props = $props();

  // Reactive to store changes
  let currentSelected = $derived($selectedCharacter);

  function handleCharacterClick(event: MouseEvent, link: string) {
    const slug = extractCharacterSlug(link);
    if (slug) {
      console.log('[selectedCharacter] Click: Setting selection from link:', { link, slug });
      selectedCharacter.set(slug);
    }
  }

  function isItemSelected(item: ListItem): boolean {
    // For character links (column 2), check store value
    // For action links (column 3) and other items, use the item.selected prop
    if (item.link && currentSelected) {
      // Only apply store logic to character detail pages (not sub-pages like /vitals or /relationships)
      // Character detail pages match: /characters/[slug] (exactly, no additional path segments)
      const isCharacterDetailPage = /^\/characters\/[^\/]+$/.test(item.link);
      if (isCharacterDetailPage) {
        const itemSlug = extractCharacterSlug(item.link);
        return itemSlug === currentSelected;
      }
    }
    // For action links and other items, use the item.selected prop from server
    return item.selected ?? false;
  }
</script>

<div class={styles.wrapper}>
  {#if header}
    <div class={styles.header}>
      {@render header()}
    </div>
  {/if}
  <ul class={styles.container}>
  {#each items as item}
    <li class="{item.starred ? styles.starred : ''} {isItemSelected(item) ? styles.selected : ''}">
      {#if item.link}
        <a href={item.link} onclick={(e) => handleCharacterClick(e, item.link!)}>
          <Text weight="md">
            {item.content}
          </Text>
        </a>
      {:else}
        <Text>
          {item.content}
        </Text>
      {/if}
    </li>
  {/each}
  </ul>
</div>
