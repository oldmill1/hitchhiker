<script lang="ts">
  import styles from './RelationshipView.module.scss';
  import type { RelationshipItem } from '$lib/data/characters';

  interface Props {
    relationshipsWithDetails?: RelationshipItem[] | null;
  }

  let { relationshipsWithDetails }: Props = $props();
</script>

{#if relationshipsWithDetails}
  <div class={styles.relationshipsList}>
    {#each relationshipsWithDetails as relationship}
      <div class={styles.relationshipItem}>
        <span class={styles.relationshipLabel}>{relationship.label}:</span>
        <span class={styles.relationshipName}>{relationship.toCharacterName}</span>
      </div>
    {/each}
  </div>
{/if}

