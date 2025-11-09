<script lang="ts">
  import styles from './ColumnLayout.module.scss';
  import { List, Infoscreen } from '$lib';
  import type { ListItem, PropItem } from '$lib/data/characters';

  interface Props {
    column1?: ListItem[] | null;
    column2?: ListItem[] | null;
    column3?: ListItem[] | null;
    column4?: PropItem[] | null;
  }

  let { column1, column2, column3, column4 }: Props = $props();
</script>

<div class={styles.container}>
  <div class={styles.column}>
    {#if column1}
      <List items={column1} />
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

