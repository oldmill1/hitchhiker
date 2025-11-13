<script lang="ts">
  import styles from './DesktopIcon.module.scss';
  import folderIcon from '$lib/assets/icons/folder.png';
  import { Text } from '$lib';
  import { goto } from '$app/navigation';

  interface Props {
    label: string;
    link?: string;
  }

  let { label, link }: Props = $props();

  function handleClick() {
    if (link) {
      goto(link);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (link && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      goto(link);
    }
  }
</script>

<div 
  class={styles.desktopIcon}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  {...(link ? { role: "button", tabindex: 0 } : {})}
>
  <img src={folderIcon} alt={label} class={styles.icon} />
  <span class={styles.label}>
    <Text size="sm" weight="sm" color="white" el="span">
      {#snippet children()}
        {label}
      {/snippet}
    </Text>
  </span>
</div>

