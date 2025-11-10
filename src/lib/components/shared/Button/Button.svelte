<script lang="ts">
  import styles from './Button.module.scss';
  
  interface Props {
    children?: any;
    onClick?: (() => void) | undefined;
    disabled?: boolean;
  }
  
  let { children = 'Button', onClick, disabled = false }: Props = $props();
</script>

<button class={styles.button} onclick={onClick} disabled={disabled}>
  {#if typeof children === 'function'}
    {@render children()}
  {:else}
    {children}
  {/if}
</button>
