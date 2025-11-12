<script lang="ts">
  import styles from './Visualizer.module.scss';
  import type { ListItem } from '$lib/data/characters';
  import { DesktopIcon } from '$lib';

  interface Props {
    homepageNavigationItems?: ListItem[] | null;
  }

  let { homepageNavigationItems }: Props = $props();
</script>

<div class={styles.visualizer}>
  {#if homepageNavigationItems}
    <div class={styles.grid}>
      {#each homepageNavigationItems as item}
        <DesktopIcon label={item.content} />
      {/each}
    </div>
  {/if}
</div>

