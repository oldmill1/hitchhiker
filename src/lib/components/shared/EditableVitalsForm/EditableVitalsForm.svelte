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
  }

  let { initialVitals = [] }: Props = $props();

  // Pre-set field names
  const PRESET_FIELDS = ['Name', 'Date of birth', 'Nationality'];

  // Initialize vitals state
  // Separate preset and custom fields
  let presetVitals = $state<VitalField[]>(
    PRESET_FIELDS.map((name) => {
      const existing = initialVitals.find((v) => v.name === name);
      return {
        id: `preset-${name}`,
        name,
        value: existing?.value || '',
        isPreset: true,
      };
    })
  );

  let customVitals = $state<VitalField[]>(
    initialVitals
      .filter((v) => !PRESET_FIELDS.includes(v.name))
      .map((v, index) => ({
        id: `custom-${index}`,
        name: v.name,
        value: v.value,
        isPreset: false,
      }))
  );

  // Track which preset field is in edit mode (for empty fields)
  let editingPresetId = $state<string | null>(null);
  let inputRefs: Record<string, HTMLInputElement> = {};

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

  function handlePresetBlur(id: string) {
    exitEditMode(id);
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

  function handleCustomValueChange(id: string, value: string) {
    customVitals = customVitals.map((v) =>
      v.id === id ? { ...v, value } : v
    );
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
          oninput={(e) =>
            handleCustomNameChange(vital.id, (e.target as HTMLInputElement).value)
          }
        />
      </div>
      <div class={styles.inputWrapper}>
        <input
          type="text"
          class={styles.input}
          value={vital.value}
          placeholder="text"
          oninput={(e) =>
            handleCustomValueChange(vital.id, (e.target as HTMLInputElement).value)
          }
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

