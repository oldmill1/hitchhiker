<script lang="ts">
  import styles from './IconBar.module.scss';
  import { Icon } from '$lib';

  interface Props {
    onComputerClick?: (() => void) | undefined;
    onHomeClick?: (() => void) | undefined;
    onFavoritesClick?: (() => void) | undefined;
  }

  let { onComputerClick, onHomeClick, onFavoritesClick }: Props = $props();
</script>

<div class={styles.iconBar}>
  <Icon type="computer" label="Computer" onClick={onComputerClick} />
  <Icon type="home" label="Home" onClick={onHomeClick} />
  <Icon type="favorites" label="Favorites" onClick={onFavoritesClick} />
</div>

