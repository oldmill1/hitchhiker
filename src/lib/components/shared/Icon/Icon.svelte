<script lang="ts">
	import IconifyIcon from '@iconify/svelte';

	interface Props {
		icon: string;
		size?: string | number;
		color?: string;
		class?: string;
		style?: string;
		width?: string | number;
		height?: string | number;
		inline?: boolean;
		hFlip?: boolean;
		vFlip?: boolean;
		rotate?: number;
	}

	let {
		icon,
		size = '1em',
		color,
		class: className = '',
		style = '',
		width,
		height,
		inline = false,
		hFlip,
		vFlip,
		rotate,
		...restProps
	}: Props = $props();

	// Ensure icon name includes the twemoji prefix if not already present
	const iconName = $derived(icon.startsWith('twemoji:') ? icon : `twemoji:${icon}`);
	
	// Build style string
	const computedStyle = $derived(() => {
		let result = style;
		if (color) {
			result += `; color: ${color}`;
		}
		if (size && !width && !height) {
			result += `; font-size: ${typeof size === 'number' ? `${size}px` : size}`;
		}
		return result;
	});
</script>

<IconifyIcon
	icon={iconName}
	width={typeof width === 'number' ? width : undefined}
	height={typeof height === 'number' ? height : undefined}
	{inline}
	{hFlip}
	{vFlip}
	{rotate}
	class={className}
	style={computedStyle()}
	{...restProps}
/>
