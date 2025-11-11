<script lang="ts">
  import styles from './EditableRelationshipsForm.module.scss';
  import { invalidateAll } from '$app/navigation';
  import { tick } from 'svelte';
  import type { RelationshipItem } from '$lib/data/characters';

  interface RelationshipField {
    id: string;
    relationshipId: string | null; // null for new relationships
    label: string;
    toCharacterSlug: string;
    toCharacterName: string;
  }

  interface Props {
    initialRelationships?: RelationshipItem[];
    availableCharacters: Array<{ name: string; slug: string }>;
    characterSlug: string;
    onSaveSuccess?: () => void;
  }

  let { 
    initialRelationships = [], 
    availableCharacters = [],
    characterSlug, 
    onSaveSuccess 
  }: Props = $props();

  // Unified relationships state - all fields use the same template
  // Initialize with saved relationships + one empty field at the end
  let relationships = $state<RelationshipField[]>(
    [
      ...initialRelationships.map((r, index) => ({
        id: `relationship-${index}-${r.label}-${Date.now()}`,
        relationshipId: r.id || null,
        label: r.label,
        toCharacterSlug: r.toCharacterSlug,
        toCharacterName: r.toCharacterName,
      })),
      {
        id: `relationship-empty-${Date.now()}`,
        relationshipId: null,
        label: '',
        toCharacterSlug: '',
        toCharacterName: '',
      }
    ]
  );

  // Track the last known initialRelationships to detect when it actually changes from server
  let lastInitialRelationshipsKey = $state<string>('');
  
  // Initialize lastInitialRelationshipsKey on mount
  $effect(() => {
    if (lastInitialRelationshipsKey === '') {
      lastInitialRelationshipsKey = JSON.stringify(initialRelationships);
    }
  });
  
  // Sync relationships with initialRelationships when it changes (after invalidation)
  // Only sync when initialRelationships actually changes from the server, not on every render
  $effect(() => {
    const currentInitialRelationshipsKey = JSON.stringify(initialRelationships);
    
    // Only sync if initialRelationships actually changed (from server refresh)
    if (currentInitialRelationshipsKey !== lastInitialRelationshipsKey && lastInitialRelationshipsKey !== '') {
      lastInitialRelationshipsKey = currentInitialRelationshipsKey;
      
      // Create a map of saved relationships by relationshipId for quick lookup
      const savedRelationshipsMap = new Map(
        initialRelationships.map(r => [r.id || '', r])
      );
      
      // Also create a map by label+characterSlug to detect duplicates
      const savedByLabelAndCharacter = new Map(
        initialRelationships.map(r => [`${r.label}|${r.toCharacterSlug}`, r])
      );
      
      // Update existing relationships: match saved relationships and preserve unsaved/empty fields
      const updatedRelationships: RelationshipField[] = [];
      const processedSavedIds = new Set<string>();
      
      // First, try to match existing relationships with saved relationships (preserve IDs when possible)
      for (const rel of relationships) {
        const isEmpty = rel.label.trim() === '' && rel.toCharacterSlug === '';
        
        if (isEmpty) {
          // Always preserve empty fields
          updatedRelationships.push(rel);
        } else if (rel.relationshipId && savedRelationshipsMap.has(rel.relationshipId)) {
          // This relationship matches a saved one by ID - update it but preserve UI ID
          const savedRel = savedRelationshipsMap.get(rel.relationshipId)!;
          updatedRelationships.push({
            id: rel.id, // Preserve the UI ID
            relationshipId: savedRel.id || null,
            label: savedRel.label,
            toCharacterSlug: savedRel.toCharacterSlug,
            toCharacterName: savedRel.toCharacterName,
          });
          processedSavedIds.add(rel.relationshipId);
        } else if (!rel.relationshipId) {
          // This is an unsaved field - check if it matches a saved one by label+character
          const key = `${rel.label}|${rel.toCharacterSlug}`;
          if (savedByLabelAndCharacter.has(key)) {
            // This matches a saved relationship - update it with the saved ID
            const savedRel = savedByLabelAndCharacter.get(key)!;
            updatedRelationships.push({
              id: rel.id, // Preserve the UI ID
              relationshipId: savedRel.id || null,
              label: savedRel.label,
              toCharacterSlug: savedRel.toCharacterSlug,
              toCharacterName: savedRel.toCharacterName,
            });
            if (savedRel.id) {
              processedSavedIds.add(savedRel.id);
            }
          } else {
            // This is a truly unsaved field being edited - preserve it
            updatedRelationships.push(rel);
          }
        } else {
          // This relationship has an ID but it's not in the server data (might have been deleted)
          // Don't include it - it will be removed
        }
      }
      
      // Add any saved relationships that weren't matched (newly saved ones from server)
      for (const [id, savedRel] of savedRelationshipsMap) {
        if (id && !processedSavedIds.has(id)) {
          updatedRelationships.push({
            id: `relationship-${Date.now()}-${savedRel.label}`,
            relationshipId: savedRel.id || null,
            label: savedRel.label,
            toCharacterSlug: savedRel.toCharacterSlug,
            toCharacterName: savedRel.toCharacterName,
          });
        }
      }
      
      relationships = updatedRelationships;
    }
  });

  // Ensure there's always exactly one empty field at the end
  // Only add a new empty field if there are no empty fields AND the last field is complete (both label and character filled)
  $effect(() => {
    const emptyFields = relationships.filter(r => r.label.trim() === '' && r.toCharacterSlug === '');
    
    if (emptyFields.length === 0) {
      // Only add an empty field if:
      // 1. There are no relationships at all, OR
      // 2. The last field has both label and character filled (user finished editing that field)
      const lastField = relationships[relationships.length - 1];
      const shouldAddEmpty = 
        relationships.length === 0 || 
        (lastField && lastField.label.trim() !== '' && lastField.toCharacterSlug !== '');
      
      if (shouldAddEmpty) {
        relationships = [
          ...relationships,
          {
            id: `relationship-empty-${Date.now()}`,
            relationshipId: null,
            label: '',
            toCharacterSlug: '',
            toCharacterName: '',
          }
        ];
      }
    } else if (emptyFields.length > 1) {
      // Keep only the last empty field
      const lastEmptyIndex = relationships.findLastIndex(r => r.label.trim() === '' && r.toCharacterSlug === '');
      relationships = relationships.filter((r, index) => {
        const isEmpty = r.label.trim() === '' && r.toCharacterSlug === '';
        return !isEmpty || index === lastEmptyIndex;
      });
    }
  });
  
  // Track saving state per field to prevent duplicate saves
  let savingFields = $state<Set<string>>(new Set());
  
  // Track which field is in "confirm delete" state
  let confirmingDeleteId = $state<string | null>(null);

  async function saveRelationship(relationshipId: string | null, label: string, toCharacterSlug: string, uiId: string): Promise<boolean> {
    const fieldKey = `${relationshipId || 'new'}-${label}-${toCharacterSlug}`;
    if (savingFields.has(fieldKey)) {
      return false; // Already saving
    }

    if (!label.trim() || !toCharacterSlug) {
      return false; // Don't save empty relationships
    }

    savingFields = new Set([...savingFields, fieldKey]);

    try {
      const formData = new FormData();
      formData.append('relationshipId', relationshipId || '');
      formData.append('label', label.trim());
      formData.append('toCharacterSlug', toCharacterSlug);

      const response = await fetch(`/characters/${characterSlug}/relationships?/saveRelationship`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.type === 'success' || result.success) {
        // Update local state with the relationship ID if it was a new relationship
        if (!relationshipId && result.relationshipId) {
          relationships = relationships.map((r) =>
            r.id === uiId ? { ...r, relationshipId: result.relationshipId } : r
          );
          // Wait for state update to complete before invalidating
          await tick();
        }
        onSaveSuccess?.();
        return true;
      } else {
        console.error('Failed to save relationship:', result);
        return false;
      }
    } catch (error) {
      console.error('Error saving relationship:', error);
      return false;
    } finally {
      savingFields = new Set([...savingFields].filter(key => key !== fieldKey));
    }
  }

  async function deleteRelationshipFromDB(relationshipId: string): Promise<boolean> {
    if (!relationshipId) {
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('relationshipId', relationshipId);

      const response = await fetch(`/characters/${characterSlug}/relationships?/deleteRelationship`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.type === 'success' || result.success) {
        onSaveSuccess?.();
        return true;
      } else {
        console.error('Failed to delete relationship:', result);
        return false;
      }
    } catch (error) {
      console.error('Error deleting relationship:', error);
      return false;
    }
  }

  async function handleRemoveClick(id: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent click from bubbling to document
    const relationship = relationships.find((r) => r.id === id);
    if (!relationship) return;

    // If already in confirm state, delete it
    if (confirmingDeleteId === id) {
      // Only delete from DB if the field has a relationshipId (was saved to DB)
      if (relationship.relationshipId) {
        const success = await deleteRelationshipFromDB(relationship.relationshipId);
        if (success) {
          // Remove from UI
          relationships = relationships.filter((r) => r.id !== id);
        }
      } else {
        // Just remove from UI if it was never saved
        relationships = relationships.filter((r) => r.id !== id);
      }
      confirmingDeleteId = null;
    } else {
      // Enter confirm state
      confirmingDeleteId = id;
    }
  }

  function cancelConfirmDelete() {
    confirmingDeleteId = null;
  }

  // Cancel confirm state when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(`.${styles.removeButton}`)) {
      cancelConfirmDelete();
    }
  }

  // Set up click outside listener
  $effect(() => {
    if (confirmingDeleteId !== null) {
      // Use setTimeout to ensure this runs after the button click handler
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
      }, 0);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  });

  function handleLabelChange(id: string, label: string) {
    relationships = relationships.map((r) =>
      r.id === id ? { ...r, label } : r
    );
  }

  function handleCharacterChange(id: string, toCharacterSlug: string) {
    const selectedCharacter = availableCharacters.find(c => c.slug === toCharacterSlug);
    relationships = relationships.map((r) =>
      r.id === id ? { 
        ...r, 
        toCharacterSlug,
        toCharacterName: selectedCharacter?.name || ''
      } : r
    );
  }

  async function handleLabelBlur(id: string) {
    const relationship = relationships.find((r) => r.id === id);
    if (relationship && relationship.label.trim() !== '' && relationship.toCharacterSlug !== '') {
      const success = await saveRelationship(
        relationship.relationshipId,
        relationship.label,
        relationship.toCharacterSlug,
        id
      );
      if (success) {
        // Invalidate to refresh page data, which will update initialRelationships
        await invalidateAll();
        onSaveSuccess?.();
      }
    }
  }

  async function handleCharacterChangeEvent(id: string, toCharacterSlug: string) {
    const relationship = relationships.find((r) => r.id === id);
    if (relationship && relationship.label.trim() !== '' && toCharacterSlug !== '') {
      // Update the relationship immediately
      handleCharacterChange(id, toCharacterSlug);
      
      // Save the relationship
      const success = await saveRelationship(
        relationship.relationshipId,
        relationship.label,
        toCharacterSlug,
        id
      );
      if (success) {
        // Invalidate to refresh page data, which will update initialRelationships
        await invalidateAll();
        onSaveSuccess?.();
      }
    }
  }

  async function handleKeydown(id: string, event: KeyboardEvent, fieldType: 'label' | 'character') {
    if (event.key === 'Enter') {
      event.preventDefault();
      const relationship = relationships.find((r) => r.id === id);
      if (relationship) {
        if (fieldType === 'label') {
          // Focus the character dropdown
          const characterSelect = document.querySelector(`[data-character-id="${id}"]`) as HTMLSelectElement;
          if (characterSelect) {
            characterSelect.focus();
          }
        } else {
          // Save and blur
          if (relationship.label.trim() !== '' && relationship.toCharacterSlug !== '') {
            const success = await saveRelationship(
              relationship.relationshipId,
              relationship.label,
              relationship.toCharacterSlug,
              id
            );
            if (success) {
              // Invalidate to refresh page data, which will update initialRelationships
              await invalidateAll();
              onSaveSuccess?.();
            }
          }
          (event.target as HTMLSelectElement).blur();
        }
      }
    }
  }
</script>

<div class={styles.container}>
  <!-- Unified fields section -->
  {#each relationships as relationship (relationship.id)}
    <div class={styles.field}>
      <div class={styles.inputWrapper}>
        <input
          type="text"
          class={styles.input}
          value={relationship.label}
          placeholder="Mamma/Daddy/etc"
          data-label-id={relationship.id}
          oninput={(e) =>
            handleLabelChange(relationship.id, (e.target as HTMLInputElement).value)
          }
          onblur={() => handleLabelBlur(relationship.id)}
          onkeydown={(e) => handleKeydown(relationship.id, e, 'label')}
        />
      </div>
      <div class={styles.inputWrapper}>
        <select
          class={styles.select}
          value={relationship.toCharacterSlug}
          data-character-id={relationship.id}
          onchange={(e) => handleCharacterChangeEvent(relationship.id, (e.target as HTMLSelectElement).value)}
          onkeydown={(e) => handleKeydown(relationship.id, e, 'character')}
        >
          <option value="">Select character...</option>
          {#each availableCharacters as char}
            <option value={char.slug}>{char.name}</option>
          {/each}
        </select>
        {#if relationship.label.trim() !== '' && relationship.toCharacterSlug !== ''}
          <button
            type="button"
            class={`${styles.removeButton} ${confirmingDeleteId === relationship.id ? styles.confirm : ''}`}
            onclick={(e) => handleRemoveClick(relationship.id, e)}
            aria-label={confirmingDeleteId === relationship.id ? "Confirm delete" : "Remove field"}
          >
            <span class={styles.removeIcon}>
              {confirmingDeleteId === relationship.id ? '×' : '−'}
            </span>
          </button>
        {/if}
      </div>
    </div>
  {/each}
</div>

