<script lang="ts">
  import styles from './VitalCard.module.scss';
  import { Text } from '$lib';

  interface Props {
    name: string;
    value: string;
  }

  let { name, value }: Props = $props();
</script>

<div class={styles.vitalCard}>
  <div class={styles.vitalName}>
    <Text size="sm" weight="sm" el="span">
      {name}
    </Text>
  </div>
  <div class={styles.vitalValue}>
    <Text size="xl" weight="md" el="span">
      {value}
    </Text>
  </div>
</div>

