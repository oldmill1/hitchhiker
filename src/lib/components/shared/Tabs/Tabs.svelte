<script lang="ts">
  import styles from './Tabs.module.scss';
  import { Icon } from '$lib';
  
  interface Tab {
    id: string;
    label: string;
    icon?: string;
  }
  
  interface Props {
    tabs?: Tab[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
  }
  
  let { 
    tabs = [
      { id: 'results', label: 'Results' },
      { id: 'favs', label: 'Favs' }
    ],
    activeTab = 'results',
    onTabChange
  }: Props = $props();
  
  function handleTabClick(tabId: string) {
    activeTab = tabId;
    onTabChange?.(tabId);
  }
</script>

<div class={styles.tabsContainer}>
  {#each tabs as tab, index (tab.id)}
    <button
      class={styles.tab}
      class:active={activeTab === tab.id}
      class:first={index === 0}
      class:last={index === tabs.length - 1}
      onclick={() => handleTabClick(tab.id)}
    >
      {#if tab.icon}
        <Icon icon={tab.icon} size="16px" class={styles.icon} />
      {/if}
      <span class={styles.label}>{tab.label}</span>
    </button>
  {/each}
</div>
