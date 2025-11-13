<script lang="ts">
  import { page } from '$app/stores';
  import styles from './Breadcrumb.module.scss';
  import { Text } from '$lib';

  interface Props {
    characterName?: string;
  }

  let { characterName }: Props = $props();

  interface BreadcrumbItem {
    label: string;
    href: string;
    isCurrent: boolean;
  }

  function formatSegment(segment: string, segmentIndex: number, allSegments: string[]): string {
    // Capitalize first letter and handle special cases
    if (segment === 'characters') return 'Characters';
    if (segment === 'vitals') return 'Vitals';
    if (segment === 'relationships') return 'Relationships';
    
    // For character slugs (second segment after 'characters'), use characterName if available
    if (segmentIndex === 1 && allSegments[0] === 'characters' && characterName) {
      return characterName;
    }
    
    // Fallback: capitalize first letter and replace hyphens with spaces
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
    // Don't show breadcrumbs on root path
    // Show breadcrumbs starting from 1+ segments (e.g., /characters, /characters/captain-ahab)
    const segments = pathname.split('/').filter(Boolean);
    
    // Only show breadcrumbs if there is at least 1 segment
    if (segments.length < 1) {
      return [];
    }

    const breadcrumbs: BreadcrumbItem[] = [];

    // Add root breadcrumb "Home" that links to home
    breadcrumbs.push({
      label: 'Home',
      href: '/',
      isCurrent: false
    });

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const isCurrent = index === segments.length - 1;
      
      breadcrumbs.push({
        label: formatSegment(segment, index, segments),
        href,
        isCurrent
      });
    });

    return breadcrumbs;
  }

  const breadcrumbs = $derived(buildBreadcrumbs($page.url.pathname));
</script>

{#if breadcrumbs.length > 0}
  <nav class={styles.breadcrumb}>
    {#each breadcrumbs as crumb, index}
      {#if crumb.isCurrent}
        <span class={styles.current}>
          <Text size="sm" weight="md">{crumb.label}</Text>
        </span>
      {:else}
        <a href={crumb.href} class={styles.link}>
          <Text size="sm" weight="xs">{crumb.label}</Text>
        </a>
      {/if}
      {#if index < breadcrumbs.length - 1}
        <span class={styles.separator}>
          <Text size="sm" weight="xs">></Text>
        </span>
      {/if}
    {/each}
  </nav>
{/if}

