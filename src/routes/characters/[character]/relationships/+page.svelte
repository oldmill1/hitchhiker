<script lang="ts">
  import { ColumnLayout, Modal, AddCharacterForm } from '$lib';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { setSelections } from '$lib/stores/multipleSelections';
  import { extractCharacterSlug } from '$lib/stores/selectedCharacter';

  let { data }: { data: PageData } = $props();

  let isAddCharacterModalOpen = $state(false);

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
</script>

<ColumnLayout 
  column1={data.charactersList} 
  column2={data.characters} 
  column3={data.actions}
  column4={data.relationships}
  onSelectAllClick={handleSelectAll}
  onAddCharacterClick={openAddCharacterModal}
/>

<Modal isOpen={isAddCharacterModalOpen} onClose={closeAddCharacterModal}>
  {#snippet children()}
    <AddCharacterForm onCancel={closeAddCharacterModal} />
  {/snippet}
</Modal>

