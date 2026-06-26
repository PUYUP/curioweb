<script lang="ts">
	import '../../../app.css';
	let { children } = $props();
</script>

<main class="main flex-1">
	{@render children()}
</main>
