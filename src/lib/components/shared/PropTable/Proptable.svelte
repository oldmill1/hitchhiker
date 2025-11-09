<script lang="ts">
  import styles from './Proptable.module.scss';
  import { Text } from '$lib';
</script>

<table class={styles.container}>
  <tbody>
    <tr>
      <td class={styles.propertyName}>
        <Text>Name</Text>
      </td>
      <td class={styles.propertyValue}>
        <Text weight="md">Albus Dumbledore</Text>
      </td>
    </tr>
    <tr>
      <td class={styles.propertyName}>
        <Text>Born</Text>
      </td>
      <td class={styles.propertyValue}>
        <Text weight="md">1881</Text>
      </td>
    </tr>
    <tr>
      <td class={styles.propertyName}>
        <Text>Died</Text>
      </td>
      <td class={styles.propertyValue}>
        <Text weight="md">30 June 1997</Text>
      </td>
    </tr>
  </tbody>
</table>
