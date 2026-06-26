<script lang="ts">
	import '../../app.css';
	import { Navbar } from '$lib/components/blocks/navbar/index.js';

	let { children } = $props();
</script>

<Navbar />

<main class="main flex-1">
	{@render children()}
</main>
