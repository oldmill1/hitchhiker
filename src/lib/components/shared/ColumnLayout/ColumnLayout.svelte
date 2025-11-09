<script lang="ts">
  import styles from './ColumnLayout.module.scss';
  import { List, Infoscreen, IconBar } from '$lib';
  import type { ListItem, PropItem } from '$lib/data/characters';
  import type { Snippet } from 'svelte';

  interface Props {
    column1?: ListItem[] | null;
    column2?: ListItem[] | null;
    column3?: ListItem[] | null;
    column4?: PropItem[] | null;
    column1Header?: Snippet;
    onSelectAllClick?: (() => void) | undefined;
    onFavoritesClick?: (() => void) | undefined;
  }

  let { column1, column2, column3, column4, column1Header, onSelectAllClick, onFavoritesClick }: Props = $props();
</script>

<div class={styles.wrapper}>
  <IconBar 
    onSelectAllClick={onSelectAllClick}
    onFavoritesClick={onFavoritesClick}
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
    {#if column4}
      <Infoscreen items={column4} />
    {/if}
  </div>
</div>
</div>

