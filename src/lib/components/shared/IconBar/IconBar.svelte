<script lang="ts">
  import styles from './IconBar.module.scss';
  import { Icon } from '$lib';

  interface Props {
    onSelectAllClick?: (() => void) | undefined;
    onFavoritesClick?: (() => void) | undefined;
  }

  let { onSelectAllClick, onFavoritesClick }: Props = $props();
</script>

<div class={styles.iconBar}>
  <Icon type="select-all" label="Select All" onClick={onSelectAllClick} />
  <Icon type="favorites" label="Favorites" onClick={onFavoritesClick} />
</div>

