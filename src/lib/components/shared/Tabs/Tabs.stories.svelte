<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tabs from './Tabs.svelte';

  const { Story } = defineMeta({
    title: 'shared/Tabs',
    component: Tabs,
  });
</script>

<!-- Default tabs with Results and Favs -->
<Story name="Default" />

<!-- Custom tabs with different labels -->
<Story name="Custom Tabs" args={{ 
  tabs: [
    { id: 'search', label: 'Search' },
    { id: 'bookmarks', label: 'Bookmarks' }
  ],
  activeTab: 'search'
}} />

<!-- Tabs with Twemoji icons -->
<Story name="With Icons" args={{ 
  tabs: [
    { id: 'results', label: 'Results', icon: 'magnifying-glass-tilted-left' },
    { id: 'favs', label: 'Favs', icon: 'star' }
  ],
  activeTab: 'results'
}} />

<!-- With tab change callback -->
<Story name="Interactive" args={{ 
  tabs: [
    { id: 'results', label: 'Results' },
    { id: 'favs', label: 'Favs' }
  ],
  activeTab: 'favs',
  onTabChange: (tabId: string) => console.log('Tab changed to:', tabId)
}} />

<!-- Single tab -->
<Story name="Single Tab" args={{ 
  tabs: [
    { id: 'only', label: 'Only Tab' }
  ],
  activeTab: 'only'
}} />

<!-- Multiple tabs -->
<Story name="Multiple Tabs" args={{ 
  tabs: [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
    { id: 'tab3', label: 'Tab 3' },
    { id: 'tab4', label: 'Tab 4' }
  ],
  activeTab: 'tab2'
}} />

<!-- Mixed tabs with and without icons -->
<Story name="Mixed Icons" args={{ 
  tabs: [
    { id: 'home', label: 'Home', icon: 'house' },
    { id: 'search', label: 'Search' },
    { id: 'favorites', label: 'Favorites', icon: 'red-heart' },
    { id: 'settings', label: 'Settings', icon: 'gear' }
  ],
  activeTab: 'search'
}} />

<!-- Travel-themed tabs -->
<Story name="Travel Tabs" args={{ 
  tabs: [
    { id: 'flights', label: 'Flights', icon: 'airplane' },
    { id: 'hotels', label: 'Hotels', icon: 'hotel' },
    { id: 'cars', label: 'Cars', icon: 'car' },
    { id: 'activities', label: 'Activities', icon: 'camera' }
  ],
  activeTab: 'flights'
}} />
