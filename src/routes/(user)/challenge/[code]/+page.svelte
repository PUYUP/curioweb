<script lang="ts">
	import { Button } from '@/lib/components/ui/button';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="block">Challenges</div>
