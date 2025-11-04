<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Icon from './Icon.svelte';

  const { Story } = defineMeta({
    title: 'Shared/Icon',
    component: Icon,
  });
</script>

<!-- Default icon -->
<Story name="Default" args={{ icon: 'airplane' }} />

<!-- Large icon -->
<Story name="Large" args={{ icon: 'hotel', size: '48px' }} />

<!-- Colored icon -->
<Story name="Colored" args={{ icon: 'car', size: '32px', color: '#ff6b6b' }} />

<!-- Inline icon -->
<Story name="Inline" args={{ icon: 'train', inline: true }} />

<!-- Travel icons showcase -->
<Story name="Travel Icons" />
