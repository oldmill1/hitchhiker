<script lang="ts">
  import styles from './Shortcut.module.scss';
  import heartIcon from '$lib/assets/icons/heart.png';
  import selectAllIcon from '$lib/assets/icons/select-all.png';
  import trashCanIcon from '$lib/assets/icons/trash-can.png';

  interface Props {
    type: 'select-all' | 'favorites' | 'trash';
    label?: string;
    onClick?: (() => void) | undefined;
  }

  let { type, label, onClick }: Props = $props();

  const iconMap: Record<'select-all' | 'favorites' | 'trash', string> = {
    'select-all': selectAllIcon,
    'favorites': heartIcon,
    'trash': trashCanIcon
  };

  const iconSrc = iconMap[type];
</script>

{#if onClick}
  <button 
    class="{styles.shortcut} {styles.clickable}" 
    onclick={onClick}
    type="button"
  >
    <img src={iconSrc} alt={label || type} class={styles.image} />
    {#if label}
      <span class={styles.label}>{label}</span>
    {/if}
  </button>
{:else}
  <div class={styles.shortcut}>
    <img src={iconSrc} alt={label || type} class={styles.image} />
    {#if label}
      <span class={styles.label}>{label}</span>
    {/if}
  </div>
{/if}

