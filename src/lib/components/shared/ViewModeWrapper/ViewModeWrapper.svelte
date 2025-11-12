<script lang="ts">
  import { ShortcutView, Breadcrumb, ColumnLayout, Visualizer } from '$lib';
  import { viewMode, toggleViewMode } from '$lib/stores/viewMode';
  import type { ListItem, PropItem } from '$lib/data/characters';
  import type { Snippet } from 'svelte';
  import styles from './ViewModeWrapper.module.scss';

  interface Props {
    column1?: ListItem[] | null;
    column2?: ListItem[] | null;
    column3?: ListItem[] | null;
    column4?: PropItem[] | null;
    column4Content?: Snippet;
    column1Header?: Snippet;
    characterName?: string;
    onSelectAllClick?: (() => void) | undefined;
    onFavoritesClick?: (() => void) | undefined;
    onTrashClick?: (() => void) | undefined;
    onAddCharacterClick?: (() => void) | undefined;
  }

  let { 
    column1, 
    column2, 
    column3, 
    column4, 
    column4Content, 
    column1Header, 
    characterName, 
    onSelectAllClick, 
    onFavoritesClick, 
    onTrashClick, 
    onAddCharacterClick 
  }: Props = $props();

  function handleViewClick() {
    toggleViewMode();
  }

  let currentViewMode = $state<'column' | 'visualizer'>('visualizer');
  
  $effect(() => {
    return viewMode.subscribe((mode) => {
      currentViewMode = mode;
    });
  });
</script>

<div class={styles.wrapper}>
  <ShortcutView 
    onSelectAllClick={onSelectAllClick}
    onFavoritesClick={onFavoritesClick}
    onTrashClick={onTrashClick}
    onAddCharacterClick={onAddCharacterClick}
    onViewClick={handleViewClick}
  />
  <Breadcrumb characterName={characterName} />
  {#if currentViewMode === 'column'}
    <ColumnLayout 
      column1={column1}
      column2={column2}
      column3={column3}
      column4={column4}
      column4Content={column4Content}
      column1Header={column1Header}
    />
  {:else}
    <Visualizer items={column2 ?? column1} />
  {/if}
</div>

