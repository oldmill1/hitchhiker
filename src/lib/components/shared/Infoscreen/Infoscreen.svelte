<script lang="ts">
  import styles from './Infoscreen.module.scss';
  import { Text } from '$lib';

  interface PropItem {
    name: string;
    value: string;
  }

  interface Props {
    items: PropItem[];
  }

  let { items }: Props = $props();
</script>

<div class={styles.container}>
  {#each items as item}
    <div class={styles.item}>
      <Text>{item.name}</Text>
    </div>
    <div class={styles.item}>
      <Text weight="md">{item.value}</Text>
    </div>
  {/each}
</div>

