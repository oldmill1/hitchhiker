<script lang="ts">
  import styles from './RelationshipView.module.scss';
  import type { RelationshipItem } from '$lib/data/characters';
  import { Text } from '$lib';

  interface Props {
    relationshipsWithDetails?: RelationshipItem[] | null;
  }

  let { relationshipsWithDetails }: Props = $props();
</script>

{#if relationshipsWithDetails}
  <div class={styles.relationshipsList}>
    {#each relationshipsWithDetails as relationship}
      <div class={styles.relationshipItem}>
        <Text el="span" weight="lg" color="#ffffff">
          {relationship.label}:
        </Text>
        <a href="/characters/{relationship.toCharacterSlug}" class={styles.characterLink}>
          <Text el="span" color="#a0a0a0">
            {relationship.toCharacterName}
          </Text>
        </a>
      </div>
    {/each}
  </div>
{/if}

