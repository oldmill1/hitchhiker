<script lang="ts">
  import { ShortcutView, Breadcrumb, ColumnLayout, Visualizer } from '$lib';
  import { viewMode, toggleViewMode, setViewMode } from '$lib/stores/viewMode';
  import type { ListItem, PropItem } from '$lib/data/characters';
  import type { Snippet } from 'svelte';
  import styles from './ViewModeWrapper.module.scss';

  interface Props {
    navigationItems?: ListItem[] | null;
    characters?: ListItem[] | null;
    actions?: ListItem[] | null;
    details?: PropItem[] | null;
    vitals?: PropItem[] | null;
    detailsContent?: Snippet;
    navigationItemsHeader?: Snippet;
    characterName?: string;
    onSelectAllClick?: (() => void) | undefined;
    onFavoritesClick?: (() => void) | undefined;
    onTrashClick?: (() => void) | undefined;
    onAddCharacterClick?: (() => void) | undefined;
  }

  let { 
    navigationItems, 
    characters, 
    actions, 
    details, 
    vitals,
    detailsContent, 
    navigationItemsHeader, 
    characterName, 
    onSelectAllClick, 
    onFavoritesClick, 
    onTrashClick, 
    onAddCharacterClick 
  }: Props = $props();

  function handleViewClick() {
    toggleViewMode();
  }

  function handleTableClick() {
    setViewMode('column');
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
    onTableClick={handleTableClick}
  />
  <Breadcrumb characterName={characterName} />
  {#if currentViewMode === 'column'}
    <ColumnLayout 
      navigationItems={navigationItems}
      characters={characters}
      actions={actions}
      details={details}
      detailsContent={detailsContent}
      navigationItemsHeader={navigationItemsHeader}
    />
  {:else}
    <Visualizer 
      navigationItems={navigationItems}
      characters={characters}
      actions={actions}
      vitals={vitals}
    />
  {/if}
</div>

