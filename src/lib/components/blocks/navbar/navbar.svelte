<script lang="ts" module>
	import logo from '$lib/assets/logo.png';
	import Button from '../../ui/button/button.svelte';
	import { resolve } from '$app/paths';
</script>

<nav class="navbar">
	<div class="max-w-7xl mx-auto py-2 px-4 flex items-center gap-3">
		<div class="logo -ml-2">
			<a href="/" aria-label="Go to home page">
				<img src={logo} alt="Curiosift" class="h-12 sm:h-16 w-auto" />
			</a>
		</div>

		<div class="ml-auto flex items-center gap-2">
			<Button href={resolve('/auth/login')} variant="link" class="w-18">Login</Button>
			<Button href={resolve('/auth/register')} class="w-18">Register</Button>
		</div>
	</div>
</nav>
