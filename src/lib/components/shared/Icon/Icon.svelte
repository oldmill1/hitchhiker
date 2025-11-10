<script lang="ts">
  import styles from './Icon.module.scss';
  import { Text } from '$lib';
  import heartIcon from '$lib/assets/icons/heart.png';
  import selectAllIcon from '$lib/assets/icons/select-all.png';

  interface Props {
    type: 'select-all' | 'favorites';
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: (() => void) | undefined;
  }

  let { type, label, size = 'md', onClick }: Props = $props();

  const iconMap: Record<'select-all' | 'favorites', string> = {
    'select-all': selectAllIcon,
    'favorites': heartIcon
  };

  const iconSrc = iconMap[type];
</script>

{#if onClick}
  <button 
    class="{styles.icon} {styles[size]} {styles.clickable}" 
    onclick={onClick}
    type="button"
  >
    <img src={iconSrc} alt={label || type} class={styles.image} />
    {#if label}
      <Text size="sm" weight="sm">{label}</Text>
    {/if}
  </button>
{:else}
  <div class="{styles.icon} {styles[size]}">
    <img src={iconSrc} alt={label || type} class={styles.image} />
    {#if label}
      <Text size="sm" weight="sm">{label}</Text>
    {/if}
  </div>
{/if}

