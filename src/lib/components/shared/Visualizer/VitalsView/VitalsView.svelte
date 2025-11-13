<script lang="ts">
  import styles from './VitalsView.module.scss';
  import type { PropItem } from '$lib/data/characters';
  import { VitalCard } from '$lib';

  interface Props {
    vitals?: PropItem[] | null;
  }

  let { vitals }: Props = $props();
</script>

{#if vitals}
  <div class={styles.vitalsGrid}>
    {#each vitals as vital}
      <VitalCard name={vital.name} value={vital.value} />
    {/each}
  </div>
{/if}

