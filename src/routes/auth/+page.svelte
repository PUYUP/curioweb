<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	export const load = (event: any) => {
		redirect(302, '/auth/login');
	};
</script>
