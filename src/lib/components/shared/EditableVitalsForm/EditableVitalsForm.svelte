<script lang="ts">
  import styles from './EditableVitalsForm.module.scss';
  import { Text } from '$lib';

  interface VitalField {
    id: string;
    name: string;
    value: string;
    isPreset: boolean;
  }

  interface Props {
    initialVitals?: Array<{ name: string; value: string }>;
    characterSlug: string;
    onSaveSuccess?: () => void;
  }

  let { initialVitals = [], characterSlug, onSaveSuccess }: Props = $props();

  // Pre-set field names (only used for special handling like Name field)
  const PRESET_FIELDS = ['Name'];

  // Initialize vitals state
  // All vitals loaded from DB go into presetVitals (use presetField template)
  // Only newly added fields go into customVitals (use field template)
  let presetVitals = $state<VitalField[]>(
    initialVitals.map((v, index) => ({
      id: `preset-${index}-${v.name}`,
      name: v.name,
      value: v.value,
      isPreset: true,
    }))
  );

  // Custom vitals are only for newly added fields (not yet saved to DB)
  let customVitals = $state<VitalField[]>([]);

  // Track which preset field is in edit mode (for empty fields)
  let editingPresetId = $state<string | null>(null);
  let inputRefs: Record<string, HTMLInputElement> = {};
  
  // Track saving state per field to prevent duplicate saves
  let savingFields = $state<Set<string>>(new Set());

  function enterEditMode(id: string) {
    editingPresetId = id;
  }

  // Focus input when entering edit mode
  $effect(() => {
    const id = editingPresetId;
    if (id !== null) {
      setTimeout(() => {
        const input = inputRefs[id];
        if (input) {
          input.focus();
        }
      }, 0);
    }
  });

  function exitEditMode(id: string) {
    const vital = presetVitals.find((v) => v.id === id);
    // Only exit edit mode if the field is still empty
    if (vital && vital.value.trim() === '') {
      editingPresetId = null;
    }
  }

  async function saveVital(name: string, value: string) {
    const fieldKey = `${name}-${value}`;
    if (savingFields.has(fieldKey)) {
      return; // Already saving
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
      } else {
        console.error('Failed to save vital:', result);
      }
    } catch (error) {
      console.error('Error saving vital:', error);
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

  function handlePresetBlur(id: string) {
    exitEditMode(id);
    const vital = presetVitals.find((v) => v.id === id);
    if (vital && vital.value.trim() !== '') {
      saveVital(vital.name, vital.value);
      // If it's the Name field, also update character name
      if (vital.name === 'Name') {
        saveCharacterName(vital.value);
      }
    }
  }

  function handlePresetKeydown(id: string, event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = inputRefs[id];
      if (input) {
        input.blur();
      }
    }
  }

  function addNewField() {
    const newId = `custom-${Date.now()}`;
    customVitals = [
      ...customVitals,
      {
        id: newId,
        name: '',
        value: '',
        isPreset: false,
      },
    ];
  }

  function removeField(id: string) {
    customVitals = customVitals.filter((v) => v.id !== id);
  }

  function handlePresetValueChange(id: string, value: string) {
    presetVitals = presetVitals.map((v) =>
      v.id === id ? { ...v, value } : v
    );
  }

  function handleCustomNameChange(id: string, name: string) {
    customVitals = customVitals.map((v) =>
      v.id === id ? { ...v, name } : v
    );
  }

  function handleCustomNameBlur(id: string) {
    const vital = customVitals.find((v) => v.id === id);
    if (vital && vital.name.trim() !== '' && vital.value.trim() !== '') {
      saveVital(vital.name, vital.value);
    }
  }

  function handleCustomValueChange(id: string, value: string) {
    customVitals = customVitals.map((v) =>
      v.id === id ? { ...v, value } : v
    );
  }

  function handleCustomValueBlur(id: string) {
    const vital = customVitals.find((v) => v.id === id);
    if (vital && vital.name.trim() !== '' && vital.value.trim() !== '') {
      saveVital(vital.name, vital.value);
    }
  }

  function handleCustomKeydown(id: string, event: KeyboardEvent, fieldType: 'name' | 'value') {
    if (event.key === 'Enter') {
      event.preventDefault();
      const vital = customVitals.find((v) => v.id === id);
      if (vital) {
        if (fieldType === 'name') {
          // Focus the value input
          const valueInput = document.querySelector(`[data-custom-value-id="${id}"]`) as HTMLInputElement;
          if (valueInput) {
            valueInput.focus();
          }
        } else {
          // Save and blur
          if (vital.name.trim() !== '' && vital.value.trim() !== '') {
            saveVital(vital.name, vital.value);
          }
          (event.target as HTMLInputElement).blur();
        }
      }
    }
  }
</script>

<div class={styles.container}>
  <!-- Pre-set fields section -->
  {#each presetVitals as vital (vital.id)}
    {@const isEmpty = vital.value.trim() === ''}
    {@const isEditing = editingPresetId === vital.id}
    {@const showInput = !isEmpty || isEditing}
    
    <div class={styles.presetField}>
      {#if showInput}
        <label class={styles.presetLabel} for={`preset-input-${vital.id}`}>
          <Text size="sm" weight="sm">
            {vital.name.toLowerCase()}
          </Text>
        </label>
        <div class={styles.inputWrapper}>
          <input
            id={`preset-input-${vital.id}`}
            type="text"
            class={styles.presetInput}
            value={vital.value}
            placeholder="text"
            bind:this={inputRefs[vital.id]}
            oninput={(e) =>
              handlePresetValueChange(vital.id, (e.target as HTMLInputElement).value)
            }
            onblur={() => handlePresetBlur(vital.id)}
            onkeydown={(e) => handlePresetKeydown(vital.id, e)}
          />
        </div>
      {:else}
        <button
          type="button"
          class={styles.emptyStateLabel}
          onclick={() => enterEditMode(vital.id)}
        >
          {vital.name}
        </button>
      {/if}
    </div>
  {/each}

  <!-- Custom fields section -->
  {#each customVitals as vital (vital.id)}
    <div class={styles.field}>
      <div class={styles.inputWrapper}>
        <input
          type="text"
          class={styles.input}
          value={vital.name}
          placeholder="text"
          data-custom-name-id={vital.id}
          oninput={(e) =>
            handleCustomNameChange(vital.id, (e.target as HTMLInputElement).value)
          }
          onblur={() => handleCustomNameBlur(vital.id)}
          onkeydown={(e) => handleCustomKeydown(vital.id, e, 'name')}
        />
      </div>
      <div class={styles.inputWrapper}>
        <input
          type="text"
          class={styles.input}
          value={vital.value}
          placeholder="text"
          data-custom-value-id={vital.id}
          oninput={(e) =>
            handleCustomValueChange(vital.id, (e.target as HTMLInputElement).value)
          }
          onblur={() => handleCustomValueBlur(vital.id)}
          onkeydown={(e) => handleCustomKeydown(vital.id, e, 'value')}
        />
        <button
          type="button"
          class={styles.removeButton}
          onclick={() => removeField(vital.id)}
          aria-label="Remove field"
        >
          <span class={styles.removeIcon}>−</span>
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

