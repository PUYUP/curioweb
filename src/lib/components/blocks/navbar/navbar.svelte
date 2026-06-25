<script lang="ts" module>
	import logo from '$lib/assets/logo.png';
	import Button from '../../ui/button/button.svelte';
</script>

<nav class="navbar">
	<div class="max-w-7xl mx-auto py-2 px-4 flex items-center gap-3">
		<div class="logo -ml-2">
			<a href="/" aria-label="Go to home page">
				<img src={logo} alt="Curiosift" class="h-12 sm:h-16 w-auto" />
			</a>
		</div>

		<div class="ml-auto">
			<Button>Subscribe</Button>
		</div>
	</div>
</nav>
