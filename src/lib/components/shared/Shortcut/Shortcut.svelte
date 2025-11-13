<script lang="ts">
  import styles from './Shortcut.module.scss';
  import heartIcon from '$lib/assets/icons/heart.png';
  import selectAllIcon from '$lib/assets/icons/select-all.png';
  import trashCanIcon from '$lib/assets/icons/trash-can.png';
  import newIcon from '$lib/assets/icons/new.png';
  import viewIcon from '$lib/assets/icons/view.png';
  import tableIcon from '$lib/assets/icons/table.png';

  interface Props {
    type: 'select-all' | 'favorites' | 'trash' | 'add-character' | 'view' | 'table';
    label?: string;
    onClick?: (() => void) | undefined;
  }

  let { type, label, onClick }: Props = $props();

  const iconMap: Record<'select-all' | 'favorites' | 'trash' | 'add-character' | 'view' | 'table', string> = {
    'select-all': selectAllIcon,
    'favorites': heartIcon,
    'trash': trashCanIcon,
    'add-character': newIcon,
    'view': viewIcon,
    'table': tableIcon
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

