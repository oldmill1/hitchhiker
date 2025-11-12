<script lang="ts">
  import { enhance } from '$app/forms';
  import { isRedirect } from '@sveltejs/kit';
  import { ViewModeWrapper, Modal, Button, Text, AddCharacterForm } from '$lib';
  import buttonStyles from '$lib/components/shared/Button/Button.module.scss';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { setSelections } from '$lib/stores/multipleSelections';
  import { extractCharacterSlug } from '$lib/stores/selectedCharacter';

  let { data }: { data: PageData } = $props();

  let isDeleteModalOpen = $state(false);
  let isAddCharacterModalOpen = $state(false);
  let submitting = $state(false);
  let error = $state<string | null>(null);

  function handleTrashClick() {
    isDeleteModalOpen = true;
  }

  function handleCloseModal() {
    if (!submitting) {
      isDeleteModalOpen = false;
      error = null;
    }
  }

  function openAddCharacterModal() {
    isAddCharacterModalOpen = true;
  }

  function closeAddCharacterModal() {
    isAddCharacterModalOpen = false;
  }

  async function handleSelectAll() {
    // Extract all character slugs from data.characters before navigation
    const slugs = data.characters
      .map((character) => extractCharacterSlug(character.link || ''))
      .filter((slug): slug is string => slug !== null);

    // Navigate to /characters if not already there
    const currentPath = get(page).url.pathname;
    if (currentPath !== '/characters') {
      await goto('/characters');
    }

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
          return;
        }

        if (formResult?.type === 'failure') {
          const data = formResult.data as { error?: string } | undefined;
          error = data?.error || 'Failed to delete character';
          submitting = false;
        } else if (formResult?.type === 'success') {
          // Redirect will be handled by SvelteKit
          return;
        } else {
          error = 'Unexpected response from server';
          submitting = false;
        }
      } catch (err) {
        // Check if it's a redirect first - redirects are thrown as errors but are actually success
        if (isRedirect(err)) {
          return;
        }
        // Only show error if it's not a redirect
        console.error('Form submission error:', err);
        error = 'An error occurred while deleting the character';
        submitting = false;
      }
    };
  }
</script>

<ViewModeWrapper 
  navigationItems={data.charactersList} 
  characters={data.characters} 
  actions={data.actions}
  characterName={data.character?.name}
  onSelectAllClick={handleSelectAll}
  onTrashClick={handleTrashClick}
  onAddCharacterClick={openAddCharacterModal}
/>

<Modal isOpen={isDeleteModalOpen} onClose={handleCloseModal}>
  {#snippet children()}
    <div>
      <Text weight="md">Delete Character</Text>
      <p style="margin: 1rem 0;">
        Are you sure you want to delete <strong>{data.character.name}</strong>? This action cannot be undone.
      </p>
      {#if error}
        <div style="color: red; margin: 1rem 0;">
          <Text>{error}</Text>
        </div>
      {/if}
      <form method="POST" action="?/delete" use:enhance={handleDelete}>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;">
          <Button onClick={handleCloseModal} disabled={submitting}>No</Button>
          <button type="submit" class={buttonStyles.button} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Yes'}
          </button>
        </div>
      </form>
    </div>
  {/snippet}
</Modal>

<Modal isOpen={isAddCharacterModalOpen} onClose={closeAddCharacterModal}>
  {#snippet children()}
    <AddCharacterForm onCancel={closeAddCharacterModal} />
  {/snippet}
</Modal>

