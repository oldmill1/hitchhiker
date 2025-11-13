<script lang="ts">
  import styles from './ShortcutView.module.scss';
  import { Shortcut } from '$lib';

  interface Props {
    onSelectAllClick?: (() => void) | undefined;
    onFavoritesClick?: (() => void) | undefined;
    onTrashClick?: (() => void) | undefined;
    onAddCharacterClick?: (() => void) | undefined;
    onViewClick?: (() => void) | undefined;
    onTableClick?: (() => void) | undefined;
  }

  let { onSelectAllClick, onFavoritesClick, onTrashClick, onAddCharacterClick, onViewClick, onTableClick }: Props = $props();
</script>

<div class={styles.shortcutView}>
  <div class={styles.leftShortcuts}>
    <Shortcut type="select-all" label="Select All" onClick={onSelectAllClick} />
    <Shortcut type="favorites" label="Favorites" onClick={onFavoritesClick} />
    <Shortcut type="add-character" label="New" onClick={onAddCharacterClick} />
    <Shortcut type="trash" label="Trash" onClick={onTrashClick} />
  </div>
  <div class={styles.rightShortcuts}>
    <Shortcut type="view" label="Visualizer" onClick={onViewClick} />
  </div>
</div>

