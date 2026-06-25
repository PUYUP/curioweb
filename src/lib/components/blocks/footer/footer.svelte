<script lang="ts">
	import Icon from 'mdi-svelte';
	import { mdiGithub, mdiLinkedin, mdiTwitter } from '@mdi/js';
	import logo from '$lib/assets/logo.png';
	import { Separator } from '@/lib/components/ui/separator/index.js';
</script>

<footer class="border-t border-border py-7">
	<div class="max-w-7xl mx-auto py-2 px-4">
		<div class="flex items-center md:items-start justify-between flex-col md:flex-row">
			<div class="block ml-0 md:-ml-2 mt-0 md:-mt-2 mb-6 md:mb-0">
				<a href="/" aria-label="Go to home page">
					<img src={logo} alt="Curiosift" class="h-14 w-auto" />
				</a>
			</div>

			<div class="flex-1 flex justify-center flex-col">
				<nav class="flex gap-3 md:gap-6 justify-center h-5">
					<a
						href="/about"
						class="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a
					>
					<Separator orientation="vertical" />
					<a
						href="/roadmap"
						class="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</a
					>
					<Separator orientation="vertical" />
					<a
						href="/pricing"
						class="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a
					>
					<Separator orientation="vertical" />
					<a
						href="/contact"
						class="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>Contact us</a
					>
				</nav>

				<div class="flex gap-6 justify-center mt-6">
					<a href="#" class="text-muted-foreground hover:text-foreground transition-colors">
						<Icon path={mdiTwitter} class="w-4 h-4" />
					</a>
					<a href="#" class="text-muted-foreground hover:text-foreground transition-colors">
						<Icon path={mdiLinkedin} class="w-4 h-4" />
					</a>
					<a href="#" class="text-muted-foreground hover:text-foreground transition-colors">
						<Icon path={mdiGithub} class="w-4 h-4" />
					</a>
				</div>
			</div>

			<p class="text-xs text-muted-foreground mt-6 md:mt-0">© 2026 Curiosift</p>
		</div>
	</div>
</footer>
