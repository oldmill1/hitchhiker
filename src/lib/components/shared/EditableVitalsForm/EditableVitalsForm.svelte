<script lang="ts">
  import styles from './EditableVitalsForm.module.scss';
  import { invalidateAll } from '$app/navigation';

  interface VitalField {
    id: string;
    name: string;
    value: string;
  }

  interface Props {
    initialVitals?: Array<{ name: string; value: string }>;
    characterSlug: string;
    onSaveSuccess?: () => void;
  }

  let { initialVitals = [], characterSlug, onSaveSuccess }: Props = $props();

  // Unified vitals state - all fields use the same template
  // Initialize with saved vitals + one empty field at the end
  let vitals = $state<VitalField[]>(
    [
      ...initialVitals.map((v, index) => ({
        id: `vital-${index}-${v.name}-${Date.now()}`,
        name: v.name,
        value: v.value,
      })),
      {
        id: `vital-empty-${Date.now()}`,
        name: '',
        value: '',
      }
    ]
  );

  // Track the last known initialVitals to detect when it actually changes from server
  let lastInitialVitalsKey = $state<string>('');
  
  // Initialize lastInitialVitalsKey on mount
  $effect(() => {
    if (lastInitialVitalsKey === '') {
      lastInitialVitalsKey = JSON.stringify(initialVitals);
    }
  });
  
  // Sync vitals with initialVitals when it changes (after invalidation)
  // Only sync when initialVitals actually changes from the server, not on every render
  $effect(() => {
    const currentInitialVitalsKey = JSON.stringify(initialVitals);
    
    // Only sync if initialVitals actually changed (from server refresh)
    if (currentInitialVitalsKey !== lastInitialVitalsKey && lastInitialVitalsKey !== '') {
      lastInitialVitalsKey = currentInitialVitalsKey;
      
      // Create a map of saved vitals by name|value for quick lookup
      const savedVitalsMap = new Map(
        initialVitals.map(v => [`${v.name}|${v.value}`, v])
      );
      
      // Update existing vitals: match saved vitals and preserve unsaved/empty fields
      const updatedVitals: VitalField[] = [];
      const processedSavedKeys = new Set<string>();
      
      // First, try to match existing vitals with saved vitals (preserve IDs when possible)
      for (const vital of vitals) {
        const key = `${vital.name}|${vital.value}`;
        const isEmpty = vital.name.trim() === '' && vital.value.trim() === '';
        
        if (isEmpty) {
          // Always preserve empty fields
          updatedVitals.push(vital);
        } else if (savedVitalsMap.has(key)) {
          // This vital matches a saved one - update it but try to preserve ID if it's similar
          const savedVital = savedVitalsMap.get(key)!;
          updatedVitals.push({
            id: vital.id, // Preserve the ID
            name: savedVital.name,
            value: savedVital.value,
          });
          processedSavedKeys.add(key);
        } else {
          // This is an unsaved field being edited - preserve it
          updatedVitals.push(vital);
        }
      }
      
      // Add any saved vitals that weren't matched (newly saved ones)
      for (const [key, savedVital] of savedVitalsMap) {
        if (!processedSavedKeys.has(key)) {
          updatedVitals.push({
            id: `vital-${Date.now()}-${savedVital.name}`,
            name: savedVital.name,
            value: savedVital.value,
          });
        }
      }
      
      vitals = updatedVitals;
    }
  });

  // Ensure there's always exactly one empty field at the end
  // Only add a new empty field if there are no empty fields AND the last field is complete (both name and value filled)
  $effect(() => {
    const emptyFields = vitals.filter(v => v.name.trim() === '' && v.value.trim() === '');
    
    if (emptyFields.length === 0) {
      // Only add an empty field if:
      // 1. There are no vitals at all, OR
      // 2. The last field has both name and value filled (user finished editing that field)
      const lastField = vitals[vitals.length - 1];
      const shouldAddEmpty = 
        vitals.length === 0 || 
        (lastField && lastField.name.trim() !== '' && lastField.value.trim() !== '');
      
      if (shouldAddEmpty) {
        vitals = [
          ...vitals,
          {
            id: `vital-empty-${Date.now()}`,
            name: '',
            value: '',
          }
        ];
      }
    } else if (emptyFields.length > 1) {
      // Keep only the last empty field
      const lastEmptyIndex = vitals.findLastIndex(v => v.name.trim() === '' && v.value.trim() === '');
      vitals = vitals.filter((v, index) => {
        const isEmpty = v.name.trim() === '' && v.value.trim() === '';
        return !isEmpty || index === lastEmptyIndex;
      });
    }
  });
  
  // Track saving state per field to prevent duplicate saves
  let savingFields = $state<Set<string>>(new Set());
  
  // Track which field is in "confirm delete" state
  let confirmingDeleteId = $state<string | null>(null);


  async function saveVital(name: string, value: string): Promise<boolean> {
    const fieldKey = `${name}-${value}`;
    if (savingFields.has(fieldKey)) {
      return false; // Already saving
    }

    savingFields = new Set([...savingFields, fieldKey]);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('value', value);

      const response = await fetch(`/characters/${characterSlug}/vitals?/saveVital`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.type === 'success' || result.success) {
        onSaveSuccess?.();
        return true;
      } else {
        console.error('Failed to save vital:', result);
        return false;
      }
    } catch (error) {
      console.error('Error saving vital:', error);
      return false;
    } finally {
      savingFields = new Set([...savingFields].filter(key => key !== fieldKey));
    }
  }


  async function saveCharacterName(name: string) {
    try {
      const formData = new FormData();
      formData.append('name', name);

      const response = await fetch(`/characters/${characterSlug}/vitals?/updateCharacterName`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.type === 'success' || result.success) {
        onSaveSuccess?.();
      } else {
        console.error('Failed to update character name:', result);
      }
    } catch (error) {
      console.error('Error updating character name:', error);
    }
  }


  async function deleteVitalFromDB(name: string): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('name', name);

      const response = await fetch(`/characters/${characterSlug}/vitals?/deleteVital`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.type === 'success' || result.success) {
        onSaveSuccess?.();
        return true;
      } else {
        console.error('Failed to delete vital:', result);
        return false;
      }
    } catch (error) {
      console.error('Error deleting vital:', error);
      return false;
    }
  }

  async function handleRemoveClick(id: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent click from bubbling to document
    const vital = vitals.find((v) => v.id === id);
    if (!vital) return;

    // If already in confirm state, delete it
    if (confirmingDeleteId === id) {
      // Only delete from DB if the field has a name (was saved to DB)
      if (vital.name.trim() !== '') {
        const success = await deleteVitalFromDB(vital.name);
        if (success) {
          // Remove from UI
          vitals = vitals.filter((v) => v.id !== id);
        }
      } else {
        // Just remove from UI if it was never saved
        vitals = vitals.filter((v) => v.id !== id);
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

  function handleNameChange(id: string, name: string) {
    vitals = vitals.map((v) =>
      v.id === id ? { ...v, name } : v
    );
  }

  function handleValueChange(id: string, value: string) {
    vitals = vitals.map((v) =>
      v.id === id ? { ...v, value } : v
    );
  }

  async function handleNameBlur(id: string) {
    const vital = vitals.find((v) => v.id === id);
    if (vital && vital.name.trim() !== '' && vital.value.trim() !== '') {
      const success = await saveVital(vital.name, vital.value);
      if (success) {
        if (vital.name === 'Name') {
          await saveCharacterName(vital.value);
        }
        // Invalidate to refresh page data, which will update initialVitals
        await invalidateAll();
        onSaveSuccess?.();
      }
    }
  }

  async function handleValueBlur(id: string) {
    const vital = vitals.find((v) => v.id === id);
    if (vital && vital.name.trim() !== '' && vital.value.trim() !== '') {
      const success = await saveVital(vital.name, vital.value);
      if (success) {
        if (vital.name === 'Name') {
          await saveCharacterName(vital.value);
        }
        // Invalidate to refresh page data, which will update initialVitals
        await invalidateAll();
        onSaveSuccess?.();
      }
    }
  }

  async function handleKeydown(id: string, event: KeyboardEvent, fieldType: 'name' | 'value') {
    if (event.key === 'Enter') {
      event.preventDefault();
      const vital = vitals.find((v) => v.id === id);
      if (vital) {
        if (fieldType === 'name') {
          // Focus the value input
          const valueInput = document.querySelector(`[data-value-id="${id}"]`) as HTMLInputElement;
          if (valueInput) {
            valueInput.focus();
          }
        } else {
          // Save and blur
          if (vital.name.trim() !== '' && vital.value.trim() !== '') {
            const success = await saveVital(vital.name, vital.value);
            if (success) {
              if (vital.name === 'Name') {
                await saveCharacterName(vital.value);
              }
              // Invalidate to refresh page data, which will update initialVitals
              await invalidateAll();
              onSaveSuccess?.();
            }
          }
          (event.target as HTMLInputElement).blur();
        }
      }
    }
  }
</script>

<div class={styles.container}>
  <!-- Unified fields section -->
  {#each vitals as vital (vital.id)}
    <div class={styles.field}>
      <div class={styles.inputWrapper}>
        <input
          type="text"
          class={styles.input}
          value={vital.name}
          placeholder="Age/Sex/etc"
          data-name-id={vital.id}
          oninput={(e) =>
            handleNameChange(vital.id, (e.target as HTMLInputElement).value)
          }
          onblur={() => handleNameBlur(vital.id)}
          onkeydown={(e) => handleKeydown(vital.id, e, 'name')}
        />
      </div>
      <div class={styles.inputWrapper}>
        <input
          type="text"
          class={styles.input}
          value={vital.value}
          placeholder="37/Male/etc"
          data-value-id={vital.id}
          oninput={(e) =>
            handleValueChange(vital.id, (e.target as HTMLInputElement).value)
          }
          onblur={() => handleValueBlur(vital.id)}
          onkeydown={(e) => handleKeydown(vital.id, e, 'value')}
        />
        {#if vital.name.trim() !== ''}
          <button
            type="button"
            class={`${styles.removeButton} ${confirmingDeleteId === vital.id ? styles.confirm : ''}`}
            onclick={(e) => handleRemoveClick(vital.id, e)}
            aria-label={confirmingDeleteId === vital.id ? "Confirm delete" : "Remove field"}
          >
            <span class={styles.removeIcon}>
              {confirmingDeleteId === vital.id ? '×' : '−'}
            </span>
          </button>
        {/if}
      </div>
    </div>
  {/each}
</div>



