<script lang="ts">
  import styles from './Proptable.module.scss';
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

<table class={styles.container}>
  <tbody>
    {#each items as item}
      <tr>
        <td class={styles.propertyName}>
          <Text>{item.name}</Text>
        </td>
        <td class={styles.propertyValue}>
          <Text weight="md">{item.value}</Text>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
