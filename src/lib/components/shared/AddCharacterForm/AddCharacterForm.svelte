<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { isRedirect } from '@sveltejs/kit';
  import styles from './AddCharacterForm.module.scss';
  import { Button, Text } from '$lib';

  interface Props {
    onCancel: () => void;
  }

  let { onCancel }: Props = $props();

  let name = $state('');
  let submitting = $state(false);
  let error = $state<string | null>(null);

  function handleSubmit() {
    return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
      submitting = true;
      error = null;

      try {
        await update();

        // result might be a promise, so await it if needed
        const formResult = result && typeof result === 'object' && 'then' in result 
          ? await result 
          : result;

        // Handle redirect
        if (formResult?.type === 'redirect') {
          onCancel();
          return;
        }

        if (formResult?.type === 'failure') {
          const data = formResult.data as { error?: string } | undefined;
          error = data?.error || 'Failed to create character';
          submitting = false;
        } else if (formResult?.type === 'success') {
          // Fallback: if redirect didn't work, navigate manually
          const data = formResult.data as { success?: boolean; slug?: string } | undefined;
          if (data?.success && data?.slug) {
            await goto(`/characters/${data.slug}/vitals`);
            onCancel();
          } else {
            error = 'Failed to create character: Invalid response';
            submitting = false;
          }
        } else {
          error = 'Unexpected response from server';
          submitting = false;
        }
      } catch (err) {
        // Check if it's a redirect first - redirects are thrown as errors but are actually success
        if (isRedirect(err)) {
          onCancel();
          return;
        }
        // Only show error if it's not a redirect
        console.error('Form submission error:', err);
        error = 'An error occurred while creating the character';
        submitting = false;
      }
    };
  }
</script>

<form 
  class={styles.form} 
  method="POST" 
  action="?/create"
  use:enhance={handleSubmit}
>
  <div class={styles.field}>
    <label class={styles.label} for="name">
      <Text weight="md">Name</Text>
    </label>
    <input
      id="name"
      name="name"
      type="text"
      class={styles.input}
      bind:value={name}
      placeholder="Enter character name"
      required
      disabled={submitting}
    />
    {#if error}
      <div class={styles.error}>
        <Text>{error}</Text>
      </div>
    {/if}
  </div>

  <div class={styles.actions}>
    <Button onClick={onCancel}>Cancel</Button>
    <button type="submit" class={styles.submitButton} disabled={submitting}>
      {submitting ? 'Adding...' : 'Add Character'}
    </button>
  </div>
</form>

