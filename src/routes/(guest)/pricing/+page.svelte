<script>
	import '../../../app.css';
	import { Footer } from '@/lib/components/blocks/footer';
</script>

<svelte:head>
	<title>ATLANIZE - Contact Us</title>
	<meta name="description" content="Contact Us - ATLANIZE" />
	<meta
		name="keywords"
		content="contact,ATLANIZE,research, curiosity, science, AI, bioinformatics, computational
		bology, data analysis, technology, education"
	/>
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="flex flex-1 items-center justify-center px-4 py-8 md:py-24">
	<div class="w-full max-w-lg">
		<p>
			This your investment to upgrade your brain. Throw brain root to the ground. Make it grow every
			days.
		</p>

		<div class="w-full max-w-sm mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
			<div class="flex items-baseline gap-1">
				<span class="text-4xl font-semibold tracking-tight text-slate-900">$4.99</span>
				<span class="text-sm font-medium text-slate-500">/month</span>
			</div>

			<ul class="mt-6 space-y-3">
				<li class="flex items-start gap-3">
					<span
						class="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-900"
					>
						<svg
							class="h-3 w-3 text-white"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</span>
					<span class="text-sm text-slate-600">2 paper recommendations every 2 days</span>
				</li>
				<li class="flex items-start gap-3">
					<span
						class="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-900"
					>
						<svg
							class="h-3 w-3 text-white"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</span>
					<span class="text-sm text-slate-600">Full essay analysis</span>
				</li>
			</ul>

			<a
				href="/auth/register"
				class="mt-8 w-full block text-center rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
			>
				Subscribe now
			</a>
		</div>
	</div>
</div>

<Footer />
