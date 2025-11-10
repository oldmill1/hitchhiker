<script lang="ts">
  import { ColumnLayout, Modal, AddCharacterForm } from '$lib';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let isAddCharacterModalOpen = $state(false);

  function openAddCharacterModal() {
    isAddCharacterModalOpen = true;
  }

  function closeAddCharacterModal() {
    isAddCharacterModalOpen = false;
  }
</script>

<ColumnLayout 
  column1={data.charactersList} 
  column2={data.characters} 
  column3={data.actions}
  column4={data.relationships}
  onAddCharacterClick={openAddCharacterModal}
/>

<Modal isOpen={isAddCharacterModalOpen} onClose={closeAddCharacterModal}>
  {#snippet children()}
    <AddCharacterForm onCancel={closeAddCharacterModal} />
  {/snippet}
</Modal>

