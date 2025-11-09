<script lang="ts">
  import styles from './List.module.scss';
  import { Text } from '$lib';
  import type { Snippet } from 'svelte';

  interface ListItem {
    content: string;
    link?: string;
    starred?: boolean;
    selected?: boolean;
  }

  interface Props {
    items: ListItem[];
    header?: Snippet;
  }

  let { items, header }: Props = $props();
</script>

<div class={styles.wrapper}>
  {#if header}
    <div class={styles.header}>
      {@render header()}
    </div>
  {/if}
  <ul class={styles.container}>
  {#each items as item}
    <li class:starred={item.starred}>
      <span class={styles.emojiSpace}>
        {#if item.selected}
          <span class={styles.bookmark}></span>
        {/if}
      </span>
      {#if item.link}
        <a href={item.link}>
          <Text weight="md">
            {item.content}
          </Text>
        </a>
      {:else}
        <Text>
          {item.content}
        </Text>
      {/if}
    </li>
  {/each}
  </ul>
</div>
