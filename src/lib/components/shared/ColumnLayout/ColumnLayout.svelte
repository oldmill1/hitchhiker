<script lang="ts">
  import styles from './ColumnLayout.module.scss';
  import { List, Infoscreen, ShortcutView } from '$lib';
  import type { ListItem, PropItem } from '$lib/data/characters';
  import type { Snippet } from 'svelte';

  interface Props {
    column1?: ListItem[] | null;
    column2?: ListItem[] | null;
    column3?: ListItem[] | null;
    column4?: PropItem[] | null;
    column4Content?: Snippet;
    column1Header?: Snippet;
    onSelectAllClick?: (() => void) | undefined;
    onFavoritesClick?: (() => void) | undefined;
    onTrashClick?: (() => void) | undefined;
    onAddCharacterClick?: (() => void) | undefined;
  }

  let { column1, column2, column3, column4, column4Content, column1Header, onSelectAllClick, onFavoritesClick, onTrashClick, onAddCharacterClick }: Props = $props();
</script>

<div class={styles.wrapper}>
  <ShortcutView 
    onSelectAllClick={onSelectAllClick}
    onFavoritesClick={onFavoritesClick}
    onTrashClick={onTrashClick}
    onAddCharacterClick={onAddCharacterClick}
  />
  <div class={styles.container}>
  <div class={styles.column}>
    {#if column1}
      <List items={column1} header={column1Header} />
    {/if}
  </div>
  <div class={styles.column}>
    {#if column2}
      <List items={column2} />
    {/if}
  </div>
  <div class={styles.column}>
    {#if column3}
      <List items={column3} />
    {/if}
  </div>
  <div class={styles.doubleColumn}>
    {#if column4Content}
      {@render column4Content()}
    {:else if column4}
      <Infoscreen items={column4} />
    {/if}
  </div>
</div>
</div>

