<script lang="ts">
  import { ColumnLayout, Modal, AddCharacterForm, EditableVitalsForm } from '$lib';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { setSelections } from '$lib/stores/multipleSelections';
  import { extractCharacterSlug } from '$lib/stores/selectedCharacter';

  let { data }: { data: PageData } = $props();

  let isAddCharacterModalOpen = $state(false);

  // Mock vitals data for visual implementation
  const mockVitals = [
    { name: 'Name', value: 'Harry James Potter' },
    { name: 'DOB', value: '31 July 1980' },
    { name: 'DOD', value: '' },
  ];

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
    const currentPath = page.url.pathname;
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
  onSelectAllClick={handleSelectAll}
  onAddCharacterClick={openAddCharacterModal}
>
  {#snippet column4Content()}
    <EditableVitalsForm initialVitals={mockVitals} />
  {/snippet}
</ColumnLayout>

<Modal isOpen={isAddCharacterModalOpen} onClose={closeAddCharacterModal}>
  {#snippet children()}
    <AddCharacterForm onCancel={closeAddCharacterModal} />
  {/snippet}
</Modal>

