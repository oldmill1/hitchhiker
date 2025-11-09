<script lang="ts">
  import styles from './List.module.scss';
  import { Text } from '$lib';

  interface ListItem {
    content: string;
    link?: string;
    starred?: boolean;
    selected?: boolean;
  }

  interface Props {
    items: ListItem[];
  }

  let { items }: Props = $props();
</script>

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
