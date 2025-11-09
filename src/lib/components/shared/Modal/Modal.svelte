<script lang="ts">
  import styles from './Modal.module.scss';
  import { Button } from '$lib';
  import type { Snippet } from 'svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    children?: Snippet;
  }

  let { isOpen, onClose, children }: Props = $props();

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  });
</script>

{#if isOpen}
  <div class={styles.overlay} onclick={handleBackdropClick} role="dialog" aria-modal="true">
    <div class={styles.modal}>
      <div class={styles.closeButton}>
        <Button onClick={onClose}>×</Button>
      </div>
      <div class={styles.content}>
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  </div>
{/if}

