<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';

  const { Story } = defineMeta({
    title: 'Components/Button',
    component: Button,
  });
</script>

<!-- Default button -->
<Story name="Default" />

<!-- Custom text -->
<Story name="Custom Text" args={{ children: 'Click Me!' }} />

<!-- With click handler -->
<Story name="With Click Handler" args={{ 
  children: 'Click to Alert',
  onClick: () => alert('Button clicked!')
}} />

<!-- Different button text -->
<Story name="Submit Button" args={{ children: 'Submit' }} />

<Story name="Cancel Button" args={{ children: 'Cancel' }} />
