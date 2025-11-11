<script lang="ts">
  import styles from './Notification.module.scss';
  import { Text } from '$lib';

  interface Props {
    message: string;
    duration?: number;
    isVisible: boolean;
  }

  let { message, duration = 3000, isVisible }: Props = $props();
</script>

{#if isVisible}
  <div class={styles.notification}>
    <Text>{message}</Text>
  </div>
{/if}

