<script lang="ts">
  import styles from './Button.module.scss';
  
  interface Props {
    children?: any;
    onClick?: (() => void) | undefined;
  }
  
  let { children = 'Button', onClick }: Props = $props();
</script>

<button class={styles.button} onclick={onClick}>
  {#if typeof children === 'function'}
    {@render children()}
  {:else}
    {children}
  {/if}
</button>
