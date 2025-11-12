<script lang="ts">
  import { enhance } from '$app/forms';
  import { isRedirect } from '@sveltejs/kit';
  import { ViewModeWrapper, Modal, AddCharacterForm, Button, Text } from '$lib';
  import buttonStyles from '$lib/components/shared/Button/Button.module.scss';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { setSelections, multipleSelections, clearSelections } from '$lib/stores/multipleSelections';
  import { extractCharacterSlug } from '$lib/stores/selectedCharacter';

  let { data }: { data: PageData } = $props();

  let isModalOpen = $state(false);
  let isDeleteModalOpen = $state(false);
  let submitting = $state(false);
  let error = $state<string | null>(null);

  // Get the count of selected items - reactive to store changes
  let selectedCount = $state(0);
  $effect(() => {
    const unsubscribe = multipleSelections.subscribe((selections) => {
      selectedCount = selections.size;
    });
    return unsubscribe;
  });

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  function handleTrashClick() {
    const selections = get(multipleSelections);
    if (selections.size > 0) {
      isDeleteModalOpen = true;
    }
  }

  function handleCloseDeleteModal() {
    if (!submitting) {
      isDeleteModalOpen = false;
      error = null;
    }
  }

  async function handleSelectAll() {
    // Navigate to /characters if not already there
    const currentPath = get(page).url.pathname;
    if (currentPath !== '/characters') {
      await goto('/characters');
    }

    // Extract all character slugs from data.characters
    const slugs = data.characters
      .map((character) => extractCharacterSlug(character.link || ''))
      .filter((slug): slug is string => slug !== null);

    // Set all slugs in the multiple selections store
    setSelections(slugs);
  }

  function handleDelete() {
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
          clearSelections();
          isDeleteModalOpen = false;
          return;
        }

        if (formResult?.type === 'failure') {
          const data = formResult.data as { error?: string } | undefined;
          error = data?.error || 'Failed to delete characters';
          submitting = false;
        } else if (formResult?.type === 'success') {
          clearSelections();
          isDeleteModalOpen = false;
          // Redirect will be handled by SvelteKit
          return;
        } else {
          error = 'Unexpected response from server';
          submitting = false;
        }
      } catch (err) {
        // Check if it's a redirect first - redirects are thrown as errors but are actually success
        if (isRedirect(err)) {
          clearSelections();
          isDeleteModalOpen = false;
          // Re-throw the redirect so SvelteKit can handle it
          throw err;
        }
        // Only show error if it's not a redirect
        console.error('Form submission error:', err);
        error = 'An error occurred while deleting the characters';
        submitting = false;
      }
    };
  }
</script>

<ViewModeWrapper 
  column1={data.charactersList} 
  column2={data.characters}
  onSelectAllClick={handleSelectAll}
  onTrashClick={handleTrashClick}
  onAddCharacterClick={openModal}
/>

<Modal isOpen={isModalOpen} onClose={closeModal}>
  {#snippet children()}
    <AddCharacterForm onCancel={closeModal} />
  {/snippet}
</Modal>

<Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
  {#snippet children()}
    <div>
      <Text weight="md">Delete Characters</Text>
      <p style="margin: 1rem 0;">
        Do you want to delete <strong>{selectedCount} {selectedCount === 1 ? 'item' : 'items'}</strong>? This action cannot be undone.
      </p>
      {#if error}
        <div style="color: red; margin: 1rem 0;">
          <Text>{error}</Text>
        </div>
      {/if}
      <form method="POST" action="?/deleteMultiple" use:enhance={handleDelete}>
        <input type="hidden" name="slugs" value={JSON.stringify(Array.from(get(multipleSelections)))} />
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;">
          <Button onClick={handleCloseDeleteModal} disabled={submitting}>No</Button>
          <button type="submit" class={buttonStyles.button} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Yes'}
          </button>
        </div>
      </form>
    </div>
  {/snippet}
</Modal>

