<script lang="ts">
  import { ColumnLayout, Modal, AddCharacterForm, Button } from '$lib';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { setSelections } from '$lib/stores/multipleSelections';
  import { extractCharacterSlug } from '$lib/stores/selectedCharacter';

  let { data }: { data: PageData } = $props();

  let isModalOpen = $state(false);

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
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
</script>

<ColumnLayout 
  column1={data.charactersList} 
  column2={data.characters}
  onSelectAllClick={handleSelectAll}
>
  {#snippet column1Header()}
    <Button onClick={openModal}>Add Character</Button>
  {/snippet}
</ColumnLayout>

<Modal isOpen={isModalOpen} onClose={closeModal}>
  {#snippet children()}
    <AddCharacterForm onCancel={closeModal} />
  {/snippet}
</Modal>

