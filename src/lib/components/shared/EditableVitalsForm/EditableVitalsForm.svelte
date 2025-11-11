<script lang="ts">
  import styles from './EditableVitalsForm.module.scss';

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
  let vitals = $state<VitalField[]>(
    initialVitals.map((v, index) => ({
      id: `vital-${index}-${v.name}-${Date.now()}`,
      name: v.name,
      value: v.value,
    }))
  );
  
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

  function addNewField() {
    const newId = `vital-${Date.now()}`;
    vitals = [
      ...vitals,
      {
        id: newId,
        name: '',
        value: '',
      },
    ];
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
      if (success && vital.name === 'Name') {
        await saveCharacterName(vital.value);
      }
    }
  }

  async function handleValueBlur(id: string) {
    const vital = vitals.find((v) => v.id === id);
    if (vital && vital.name.trim() !== '' && vital.value.trim() !== '') {
      const success = await saveVital(vital.name, vital.value);
      if (success && vital.name === 'Name') {
        await saveCharacterName(vital.value);
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
            if (success && vital.name === 'Name') {
              await saveCharacterName(vital.value);
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
          placeholder="text"
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
          placeholder="text"
          data-value-id={vital.id}
          oninput={(e) =>
            handleValueChange(vital.id, (e.target as HTMLInputElement).value)
          }
          onblur={() => handleValueBlur(vital.id)}
          onkeydown={(e) => handleKeydown(vital.id, e, 'value')}
        />
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
      </div>
    </div>
  {/each}

  <!-- Add another field button -->
  <div class={styles.addFieldSection}>
    <button type="button" class={styles.addFieldButton} onclick={addNewField}>
      <span class={styles.addIcon}>+</span>
      <span>add another field</span>
    </button>
    <button type="button" class={styles.dropdownButton} aria-label="More options">
      <span class={styles.dropdownIcon}>⌄</span>
    </button>
  </div>
</div>



