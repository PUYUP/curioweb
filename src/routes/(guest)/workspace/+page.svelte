<script lang="ts">
	import '../../../app.css';
	import { Footer } from '@/lib/components/blocks/footer';
	import { Button } from '@/lib/components/ui/button';
	import { Badge } from '@/lib/components/ui/badge';
</script>

<svelte:head>
	<title>ATLANIZE - Workspace Features</title>
	<meta
		name="description"
		content="Discover ATLANIZE Workspace and its powerful Research Context feature to find papers seamlessly."
	/>
	<meta
		name="keywords"
		content="workspace, ATLANIZE, research context, AI, literature review, papers, academic search"
	/>
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-4rem)] w-full">
	<!-- Hero Section -->
	<section
		class="flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-32 text-center bg-gradient-to-b from-background to-muted/30"
	>
		<Badge class="mb-6 px-3 py-1 text-sm shadow-sm" variant="secondary">New Feature</Badge>
		<h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
			Supercharge your research with <span
				class="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"
				>Workspace</span
			>
		</h1>
		<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
			Organize your thoughts, build focused contexts, and let our intelligent engine find the most
			relevant academic papers tailored specifically for you.
		</p>
		<div class="flex flex-col sm:flex-row gap-4">
			<Button size="lg" href="/auth/register" class="px-8 shadow-md">Get Started</Button>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="py-24 px-6 md:px-12 container mx-auto max-w-7xl">
		<div class="text-center mb-16 md:mb-24">
			<h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-4">
				Powerful tools for researchers
			</h2>
			<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
				Everything you need to streamline your literature review process and discover breakthroughs
				faster.
			</p>
		</div>

		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<div class="space-y-8 order-2 lg:order-1">
				<div>
					<div
						class="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-6 shadow-inner text-primary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" x2="12" y1="15" y2="3" />
						</svg>
					</div>
					<h3 class="text-3xl font-bold mb-4">Research Contexts</h3>
					<p class="text-lg text-muted-foreground leading-relaxed">
						Stop drowning in generic search results. Create specific <strong
							>Research Contexts</strong
						> by defining your topic, objectives, and keywords. Our system uses these contexts to deeply
						analyze and recommend papers that are highly relevant to your exact needs.
					</p>
				</div>
				<ul class="space-y-4 pt-4 border-t border-border/50">
					<li class="flex items-start gap-4">
						<div class="mt-1 bg-green-500/10 p-1 rounded-full text-green-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
						<div>
							<strong class="block text-foreground">Define precise parameters</strong>
							<span class="text-muted-foreground text-sm"
								>Tell us exactly what you're looking for in your research.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="mt-1 bg-green-500/10 p-1 rounded-full text-green-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
						<div>
							<strong class="block text-foreground">AI-powered matching</strong>
							<span class="text-muted-foreground text-sm"
								>Our intelligent engine finds semantic matches across millions of papers.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="mt-1 bg-green-500/10 p-1 rounded-full text-green-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
						<div>
							<strong class="block text-foreground">Semantic Chunking</strong>
							<span class="text-muted-foreground text-sm"
								>Maximizes the discovery of relevant papers per context-aware query, ensuring deep
								semantic matches.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="mt-1 bg-green-500/10 p-1 rounded-full text-green-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
						<div>
							<strong class="block text-foreground">Organize systematically</strong>
							<span class="text-muted-foreground text-sm"
								>Keep all your sources grouped neatly inside your workspaces.</span
							>
						</div>
					</li>
				</ul>
			</div>

			<div
				class="relative rounded-2xl border bg-card p-3 shadow-2xl overflow-hidden order-1 lg:order-2 group"
			>
				<div
					class="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none"
				></div>
				<div
					class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"
				></div>
				<div
					class="rounded-xl border bg-background/80 backdrop-blur-sm p-8 space-y-6 relative z-10"
				>
					<div class="flex items-center gap-4 mb-8">
						<div
							class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shadow-sm text-primary"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path
									d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
								/></svg
							>
						</div>
						<div>
							<h4 class="font-bold text-base">New Context</h4>
							<p class="text-sm text-muted-foreground">CRISPR-Cas9 in agricultural biotechnology</p>
						</div>
					</div>

					<div class="space-y-4">
						<div class="h-2 w-full bg-muted rounded-full"></div>
						<div class="h-2 w-5/6 bg-muted rounded-full"></div>
						<div class="h-2 w-4/6 bg-muted rounded-full"></div>
					</div>

					<div class="pt-8 flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
						<Badge
							class="mb-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 w-max sticky top-0 z-10 backdrop-blur-md"
							>⚡ 5 New Papers Found</Badge
						>

						<!-- Card 1 -->
						<div
							class="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 relative group/card"
						>
							<div class="absolute right-3 top-3">
								<Badge
									variant="outline"
									class="bg-green-500/10 text-green-600 border-green-500/20 text-xs font-semibold"
									>98% Match</Badge
								>
							</div>
							<div class="p-4 pr-24 flex flex-col space-y-1.5">
								<h4 class="text-sm font-bold leading-tight mb-1">
									Targeted genome editing in crops
								</h4>
								<p class="text-xs flex items-center gap-2 text-muted-foreground">
									<span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
									Nature Biotechnology • 2024
								</p>
							</div>
						</div>

						<!-- Card 3 -->
						<div
							class="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 relative group/card"
						>
							<div class="absolute right-3 top-3">
								<Badge
									variant="outline"
									class="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs font-semibold"
									>89% Match</Badge
								>
							</div>
							<div class="p-4 pr-24 flex flex-col space-y-1.5">
								<h4 class="text-sm font-bold leading-tight mb-1">
									Future of agricultural biotechnology
								</h4>
								<p class="text-xs flex items-center gap-2 text-muted-foreground">
									<span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
									Bioethics • 2024
								</p>
							</div>
						</div>

						<!-- Card 5 -->
						<div
							class="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 relative group/card opacity-70"
						>
							<div class="absolute right-3 top-3">
								<Badge
									variant="outline"
									class="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs font-semibold"
									>76% Match</Badge
								>
							</div>
							<div class="p-4 pr-24 flex flex-col space-y-1.5">
								<h4 class="text-sm font-bold leading-tight mb-1">
									Off-target effects in CRISPR crops
								</h4>
								<p class="text-xs flex items-center gap-2 text-muted-foreground">
									<span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
									Agri-tech Reviews • 2023
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<Footer />
