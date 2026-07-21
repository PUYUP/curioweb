<script lang="ts" module>
	import logo from '$lib/assets/atlanize-logo.png';
	import icon from '$lib/assets/atlanize-icon.png';
	import Button from '../../ui/button/button.svelte';
	import { resolve } from '$app/paths';
</script>

<nav class="navbar">
	<div class="max-w-7xl mx-auto py-2 px-4 flex items-center gap-3">
		<div class="logo -ml-2">
			<a href="/" aria-label="Go to home page" class="flex items-center gap-2">
				<img src={icon} alt="ATLANIZE Icon" class="h-14 w-auto" />
				<span class="uppercase text-2xl tracking-wider"><i>a</i>tlanize</span>
			</a>
		</div>

		<div class="ml-auto flex items-center gap-2">
			<Button href={resolve('/auth/login')} variant="link" class="w-18">Login</Button>
			<Button href={resolve('/auth/register')} class="w-18">Register</Button>
		</div>
	</div>
</nav>
