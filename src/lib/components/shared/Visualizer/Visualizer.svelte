<script lang="ts">
  import styles from './Visualizer.module.scss';
  import type { ListItem } from '$lib/data/characters';
  import { DesktopIcon } from '$lib';

  interface Props {
    items?: ListItem[] | null;
  }

  let { items }: Props = $props();
</script>

<div class={styles.visualizer}>
  {#if items}
    <div class={styles.grid}>
      {#each items as item}
        <DesktopIcon label={item.content} />
      {/each}
    </div>
  {/if}
</div>

