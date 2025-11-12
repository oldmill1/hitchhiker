<script lang="ts">
  import styles from './DesktopIcon.module.scss';
  import folderIcon from '$lib/assets/icons/folder.png';
  import { Text } from '$lib';

  interface Props {
    label: string;
  }

  let { label }: Props = $props();
</script>

<div class={styles.desktopIcon}>
  <img src={folderIcon} alt={label} class={styles.icon} />
  <span class={styles.label}>
    <Text size="sm" weight="sm" color="white" el="span">
      {#snippet children()}
        {label}
      {/snippet}
    </Text>
  </span>
</div>

