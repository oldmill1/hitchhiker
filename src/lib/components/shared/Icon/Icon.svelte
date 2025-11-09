<script lang="ts">
  import styles from './Icon.module.scss';

  interface Props {
    type: 'computer' | 'home' | 'favorites';
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: (() => void) | undefined;
  }

  let { type, label, size = 'md', onClick }: Props = $props();

  const iconMap: Record<'computer' | 'home' | 'favorites', string> = {
    computer: '💻',
    home: '🏠',
    favorites: '❤️'
  };

  const icon = iconMap[type];
</script>

{#if onClick}
  <button 
    class="{styles.icon} {styles[size]} {styles.clickable}" 
    onclick={onClick}
    type="button"
  >
    <div class={styles.emoji}>{icon}</div>
    {#if label}
      <div class={styles.label}>{label}</div>
    {/if}
  </button>
{:else}
  <div class="{styles.icon} {styles[size]}">
    <div class={styles.emoji}>{icon}</div>
    {#if label}
      <div class={styles.label}>{label}</div>
    {/if}
  </div>
{/if}

