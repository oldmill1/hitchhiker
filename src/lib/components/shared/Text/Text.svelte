<script lang="ts">
  import styles from './Text.module.scss';
  
  interface Props {
    el?: string;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | string;
    weight?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    font?: 'Averia Serif Libre' | 'Bitcount Grid Double' | 'Work Sans' | 'Young Serif';
    color?: string;
    children?: any;
  }
  
  let { el = 'p', size = 'md', weight = 'md', font = 'Work Sans', color, children }: Props = $props();
  
  // Check if size is a predefined size or a custom value
  const predefinedSizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const isCustomSize = !predefinedSizes.includes(size);
  const customSizeStyle = isCustomSize ? `font-size: ${size};` : '';
  
  // Build the style string with proper font-family
  const styleString = `font-family: "${font}", sans-serif; ${color ? `color: ${color};` : ''} ${customSizeStyle}`;
</script>

<svelte:element this={el} class="{styles.container} {!isCustomSize ? styles[size] : ''} {styles[`weight-${weight}`]}" style={styleString}>{@render children?.()}</svelte:element>
