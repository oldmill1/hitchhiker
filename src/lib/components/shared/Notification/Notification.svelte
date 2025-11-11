<script lang="ts">
  import styles from './Notification.module.scss';
  import { Text } from '$lib';
  import successIcon from '$lib/assets/icons/success.png';

  interface Props {
    message: string;
    duration?: number;
    isVisible: boolean;
  }

  let { message, duration = 3000, isVisible }: Props = $props();
</script>

{#if isVisible}
  <div class={styles.notification}>
    <img src={successIcon} alt="" class={styles.icon} />
    <Text size="sm" weight="md" color="#64748b">{message}</Text>
  </div>
{/if}

