<script lang="ts">
	import { enhance } from '$app/forms';
	import type { LayoutServerData } from './$types';

	let { data }: { data: LayoutServerData } = $props();
</script>

<svelte:head>
	<title>{data.user.name} - Dashboard</title>
	<meta
		name="description"
		content="Discover the latest research and challenge your curiosity with CurioSift."
	/>
	<meta
		name="keywords"
		content="research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="CurioSift" />
</svelte:head>

<h1>Hi, {data.user.name}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form method="post" action="?/signOut" use:enhance>
	<button>Sign out</button>
</form>
