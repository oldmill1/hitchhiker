<script lang="ts">
  import { ColumnLayout, Modal, AddCharacterForm, Button } from '$lib';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let isModalOpen = $state(false);

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<ColumnLayout 
  column1={data.charactersList} 
  column2={data.characters}
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

