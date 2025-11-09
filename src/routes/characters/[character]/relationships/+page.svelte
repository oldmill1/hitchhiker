<script lang="ts">
  import { ColumnLayout } from '$lib';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<ColumnLayout 
  column1={data.charactersList} 
  column2={data.characters} 
  column3={data.actions}
  column4={data.relationships}
/>

