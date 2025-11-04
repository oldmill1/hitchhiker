# Storybook Story Patterns Documentation

## Overview
This document outlines the two main story patterns used in the application for Storybook with **Svelte 5**. This project uses Svelte 5 exclusively - no Svelte 4 syntax or patterns.

---

## Svelte 5 Requirements

**This project uses Svelte 5 features exclusively:**
- ✅ Runes syntax (`$props()`, `$state()`, etc.)
- ✅ Snippets (replaces slots from Svelte 4)
- ✅ `{@render snippet()}` syntax
- ❌ NO Svelte 4 slots
- ❌ NO `let:` directives
- ❌ NO `<slot>` elements

**Storybook Compatibility:**
- Requires `@storybook/addon-svelte-csf` v5.0+
- Snippets are first-class citizens in story definitions
- Template snippets must be defined at file level, not inside `<Story>` components

---

## Pattern 1: Simple Args Pattern (Props Only)

**Use when:** Component accepts only regular props (no snippets)

**Example Component:** `Nav.svelte`

### Component Props:
- `items?: NavItem[]` - Navigation items array (default: 4 items)
- `textWeight?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'` (default: `'sm'`)
- `textFont?: 'Averia Serif Libre' | 'Bitcount Grid Double' | 'Work Sans' | 'Young Serif'` (default: `'Work Sans'`)
- `layout?: 'horizontal' | 'vertical'` (default: `'horizontal'`)

### Story Pattern:
```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Nav from './Nav.svelte';

  const { Story } = defineMeta({
    title: 'Components/Nav',
    component: Nav,
  });
</script>

<!-- Simple: just pass args, Storybook auto-renders -->
<Story name="Default" />

<!-- With args -->
<Story name="Custom Items" args={{ 
  items: [...],
  textFont: 'Young Serif' 
}} />
```

**Notes:**
- No `render` property needed
- Stories can omit content entirely - Storybook automatically renders component with args
- `<Nav {...args} />` syntax is optional/redundant but harmless
- This is the recommended pattern for prop-only components

---

## Pattern 2: Render Template Pattern (With Snippets)

**Use when:** Component accepts Svelte 5 snippet props

**Example Component:** `Topbar.svelte`

### Component Props:
- `position?: 'left' | 'center' | 'right'` (default: `'left'`)
- `heading?: Snippet` - Snippet for heading content
- `nav?: Snippet` - Snippet for navigation content

### Component Implementation (Svelte 5):
```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  
  interface Props {
    position?: 'left' | 'center' | 'right';
    heading?: Snippet;
    nav?: Snippet;
  }
  
  let { position = 'left', heading, nav }: Props = $props();
</script>

<div class="container">
  {#if heading}
    {@render heading()}
  {/if}
  {#if nav}
    {@render nav()}
  {/if}
</div>
```

### Story Pattern:
```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Topbar from './Topbar.svelte';
  import Text from '../../shared/text/Text.svelte';
  import Nav from '../nav/Nav.svelte';

  const { Story } = defineMeta({
    component: Topbar,
    title: 'Components/Topbar',
    render: template, // 👈 Reference template snippet defined below
  });
</script>

<!-- Define template snippet at FILE LEVEL (not inside Story) -->
{#snippet template(args)}
  <Topbar position={args.position}>
    {#snippet heading()}
      <Text size="lg" weight="lg">Travel Planner</Text>
    {/snippet}
    {#snippet nav()}
      <Nav items={[...]} />
    {/snippet}
  </Topbar>
{/snippet}

<!-- Stories reference the template and override args -->
<Story name="Left Position" args={{ position: 'left' }} />
<Story name="Center Position" args={{ position: 'center' }} />
```

**Critical Requirements:**
1. Define `{#snippet template(args)}` **outside** `<Story>` tags (at file level)
2. Reference template in `defineMeta({ render: template })`
3. Define child snippets inside the template using `{#snippet name()}`
4. Render snippets with `{@render snippetName()}`
5. Individual stories only pass primitive args (like `position`)

**Why This Pattern:**
- Storybook's `<Story>` component doesn't support `{#snippet}` syntax directly inside it
- Template must be defined at file level and referenced via `render` property
- This is the official Svelte 5 + Storybook addon-svelte-csf v5+ pattern
- Snippets are props in Svelte 5, making them passable but requiring special handling in Storybook

---

## Decision Tree

```
Does component accept snippet props?
├─ NO  → Use Pattern 1 (Simple Args)
│         - Define component in meta
│         - Pass args directly to Story
│         - Optional: <Component {...args} />
│
└─ YES → Use Pattern 2 (Render Template)
          - Define template snippet at file level
          - Reference in render property
          - Define child snippets inside template
          - Pass primitive args to Story
```

---

## Svelte 5 vs Svelte 4 (What NOT to do)

| Svelte 4 (OLD) ❌ | Svelte 5 (NEW) ✅ |
|-------------------|-------------------|
| `<slot />` | `{@render children()}` |
| `<slot name="header" />` | Named snippet props |
| `let:args` | `{#snippet template(args)}` |
| `export let prop` | `let { prop } = $props()` |
| Store subscriptions `$store` | `$state()`, `$derived()` |

**Never use Svelte 4 syntax in this project.**

---

## Common Mistake: Snippet Prop Names vs Snippet Definitions

### ❌ WRONG - Naming collision

```svelte
{#snippet template(args)}
  <Landing>
    {#snippet text()}  <!-- ERROR: "text" is Landing's prop name -->
      <Text>Content</Text>
    {/snippet}
  </Landing>
{/snippet}
```

**Error:** `Cannot read properties of null (reading 'Symbol(svelte.snippet)')`

**Why it fails:** You're defining a child snippet called `text`, but Landing expects `text` as a **prop**. The snippet name and prop name clash.

### ✅ CORRECT - Explicit prop passing

```svelte
{#snippet template(args)}
  <Landing text={myTextSnippet}>  <!-- Pass snippet as prop -->
    {#snippet myTextSnippet()}     <!-- Define with different name -->
      <Text>Content</Text>
    {/snippet}
  </Landing>
{/snippet}
```

**Rule:** When passing snippets to components:
1. Define the snippet inside the component tags with **any name you want**
2. **Explicitly pass it** as the prop: `<Component propName={snippetName}>`
3. The snippet definition name and prop name **should be different** to avoid confusion

### Pattern for Components with Snippet Props

```svelte
{#snippet template(args)}
  <ComponentName snippetProp={localSnippetName}>
    {#snippet localSnippetName()}
      <!-- content here -->
    {/snippet}
  </ComponentName>
{/snippet}
```

**Example with multiple snippets:**
```svelte
{#snippet template(args)}
  <Topbar position={args.position} heading={headingSnippet} nav={navSnippet}>
    {#snippet headingSnippet()}
      <Text>Heading</Text>
    {/snippet}
    {#snippet navSnippet()}
      <Nav items={[...]} />
    {/snippet}
  </Topbar>
{/snippet}
```

Notice: `heading={headingSnippet}` and `nav={navSnippet}` - we explicitly pass the snippets as props.