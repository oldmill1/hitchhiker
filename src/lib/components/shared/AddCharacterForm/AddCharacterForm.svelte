<script lang="ts">
  import styles from './AddCharacterForm.module.scss';
  import { Button, Text } from '$lib';

  interface Props {
    onCancel: () => void;
  }

  let { onCancel }: Props = $props();

  let name = $state('');

  function handleSubmit(event: Event) {
    event.preventDefault();
    // TODO: Add submit logic later
    console.log('Form submitted with name:', name);
  }
</script>

<form class={styles.form} onsubmit={handleSubmit}>
  <div class={styles.field}>
    <label class={styles.label} for="name">
      <Text weight="md">Name</Text>
    </label>
    <input
      id="name"
      type="text"
      class={styles.input}
      bind:value={name}
      placeholder="Enter character name"
      required
    />
  </div>

  <div class={styles.actions}>
    <Button onClick={onCancel}>Cancel</Button>
    <button type="submit" class={styles.submitButton}>Add Character</button>
  </div>
</form>

