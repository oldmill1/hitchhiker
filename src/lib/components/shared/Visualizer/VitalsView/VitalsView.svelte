<script lang="ts">
  import styles from './VitalsView.module.scss';
  import type { PropItem } from '$lib/data/characters';
  import { Text } from '$lib';

  interface Props {
    vitals?: PropItem[] | null;
  }

  let { vitals }: Props = $props();
</script>

{#if vitals}
  <div class={styles.vitalsList}>
    {#each vitals as vital}
      <div class={styles.vitalItem}>
        <Text el="span" weight="lg" color="#ffffff">
          {vital.name}:
        </Text>
        <Text el="span" color="#a0a0a0">
          {vital.value}
        </Text>
      </div>
    {/each}
  </div>
{/if}

