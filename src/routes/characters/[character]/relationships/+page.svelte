<script lang="ts">
  import { ViewModeWrapper, Modal, AddCharacterForm, EditableRelationshipsForm, Notification } from '$lib';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { setSelections } from '$lib/stores/multipleSelections';
  import { extractCharacterSlug } from '$lib/stores/selectedCharacter';

  let { data }: { data: PageData } = $props();

  let isAddCharacterModalOpen = $state(false);
  let notificationVisible = $state(false);
  let notificationMessage = $state('Saved');

  // Get character slug from page params
  const characterSlug = $derived(page.params.character || '');

  function showNotification(message: string = 'Saved') {
    notificationMessage = message;
    notificationVisible = true;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notificationVisible = false;
    }, 3000);
  }

  function handleSaveSuccess() {
    showNotification('Saved');
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
    const currentPath = page.url.pathname;
    if (currentPath !== '/characters') {
      await goto('/characters');
    }

    // Set all slugs in the multiple selections store
    setSelections(slugs);
  }
</script>

<ViewModeWrapper 
  column1={data.charactersList} 
  column2={data.characters} 
  column3={data.actions}
  characterName={data.character?.name}
  onSelectAllClick={handleSelectAll}
  onAddCharacterClick={openAddCharacterModal}
>
  {#snippet column4Content()}
    <EditableRelationshipsForm 
      initialRelationships={data.relationshipsWithDetails} 
      availableCharacters={data.availableCharacters}
      characterSlug={characterSlug}
      onSaveSuccess={handleSaveSuccess}
    />
  {/snippet}
</ViewModeWrapper>

<Notification 
  message={notificationMessage} 
  isVisible={notificationVisible} 
/>

<Modal isOpen={isAddCharacterModalOpen} onClose={closeAddCharacterModal}>
  {#snippet children()}
    <AddCharacterForm onCancel={closeAddCharacterModal} />
  {/snippet}
</Modal>

