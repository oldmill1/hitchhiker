<script lang="ts">
  import styles from './ShortcutView.module.scss';
  import { Shortcut } from '$lib';

  interface Props {
    onSelectAllClick?: (() => void) | undefined;
    onFavoritesClick?: (() => void) | undefined;
    onTrashClick?: (() => void) | undefined;
  }

  let { onSelectAllClick, onFavoritesClick, onTrashClick }: Props = $props();
</script>

<div class={styles.shortcutView}>
  <Shortcut type="select-all" label="Select All" onClick={onSelectAllClick} />
  <Shortcut type="favorites" label="Favorites" onClick={onFavoritesClick} />
  <Shortcut type="trash" label="Trash" onClick={onTrashClick} />
</div>

