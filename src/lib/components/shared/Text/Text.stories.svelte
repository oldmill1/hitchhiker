<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Text from './Text.svelte';

  const { Story } = defineMeta({
    title: 'shared/Text',
    component: Text,
  });
</script>

<Story name="Size Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Text size="xxs">XXS: Extra Extra Small Text (10px)</Text>
    <Text size="xs">XS: Extra Small Text (14px)</Text>
    <Text size="sm">SM: Small Text (16px)</Text>
    <Text size="md">MD: Medium Text (24px) - Default</Text>
    <Text size="lg">LG: Large Text (28px)</Text>
    <Text size="xl">XL: Extra Large Text (32px)</Text>
    <Text size="xxl">XXL: Extra Extra Large Text (38px)</Text>
  </div>
</Story>

<Story name="Weight Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Text weight="xxs">XXS: 300 - Extra Extra Light weight text</Text>
    <Text weight="xs">XS: 400 - Extra Light weight text</Text>
    <Text weight="sm">SM: 500 - Small weight text</Text>
    <Text weight="md">MD: 600 - Medium weight text (Default)</Text>
    <Text weight="lg">LG: 700 - Large weight text</Text>
    <Text weight="xl">XL: 800 - Extra Large weight text</Text>
    <Text weight="xxl">XXL: 900 - Extra Extra Large weight text</Text>
  </div>
</Story>

<Story name="Font Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Text font="Work Sans">Work Sans - Default font family</Text>
    <Text font="Averia Serif Libre">Averia Serif Libre - Serif font with character</Text>
    <Text font="Bitcount Grid Double">Bitcount Grid Double - Modern display font</Text>
    <Text font="Young Serif">Young Serif - Clean serif typography</Text>
  </div>
</Story>

<Story name="Default Paragraph">
  <Text>This is a sample paragraph text with default size.</Text>
</Story>

<Story name="Heading 1">
  <Text el="h1" size="xxl" weight="lg">Welcome to Our Travel Planner</Text>
</Story>

<Story name="Heading 2">
  <Text el="h2" size="xl" weight="md">Plan Your Next Adventure</Text>
</Story>

<Story name="Heading 3">
  <Text el="h3" size="lg" weight="sm">Discover Amazing Destinations</Text>
</Story>

<Story name="Small Text">
  <Text size="sm" weight="xs">This is small text for captions or secondary information.</Text>
</Story>

<Story name="Large Text">
  <Text size="lg" weight="md">This is large text for emphasis or important content.</Text>
</Story>

<Story name="Bold Text">
  <Text weight="lg">This text is bold for emphasis.</Text>
</Story>

<Story name="Light Text">
  <Text weight="xxs">This text is light weight for subtle content.</Text>
</Story>

<Story name="Blockquote">
  <Text el="blockquote" size="lg" weight="sm">
    "Travel is the only thing you buy that makes you richer."
  </Text>
</Story>

<Story name="Color Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Text color="#333333">Default Dark Gray Text</Text>
    <Text color="#666666">Medium Gray Text</Text>
    <Text color="#999999">Light Gray Text</Text>
    <Text color="#007bff">Blue Text</Text>
    <Text color="#28a745">Green Text</Text>
    <Text color="#dc3545">Red Text</Text>
    <Text color="#ffc107">Yellow Text</Text>
    <Text color="#6f42c1">Purple Text</Text>
    <Text color="#fd7e14">Orange Text</Text>
    <Text color="#20c997">Teal Text</Text>
  </div>
</Story>

<Story name="Custom Size Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Text size="0.5rem">Custom: 0.5rem (8px) - Very small text</Text>
    <Text size="1.2rem">Custom: 1.2rem (19.2px) - Slightly larger than default</Text>
    <Text size="2.5rem">Custom: 2.5rem (40px) - Large custom size</Text>
    <Text size="3rem">Custom: 3rem (48px) - Extra large custom size</Text>
    <Text size="12px">Custom: 12px - Pixel value</Text>
    <Text size="18px">Custom: 18px - Pixel value</Text>
    <Text size="1.8em">Custom: 1.8em - Relative to parent</Text>
    <Text size="clamp(1rem, 2.5vw, 2rem)">Custom: clamp(1rem, 2.5vw, 2rem) - Responsive size</Text>
  </div>
</Story>