<script lang="ts">
  import { ViewModeWrapper, Modal, AddCharacterForm } from '$lib';
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

<ViewModeWrapper 
  column1={data.charactersList} 
  onAddCharacterClick={openAddCharacterModal}
/>

<Modal isOpen={isAddCharacterModalOpen} onClose={closeAddCharacterModal}>
  {#snippet children()}
    <AddCharacterForm onCancel={closeAddCharacterModal} />
  {/snippet}
</Modal>
