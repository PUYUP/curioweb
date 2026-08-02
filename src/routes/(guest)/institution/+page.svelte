<script lang="ts">
	import '../../../app.css';
	import { Footer } from '@/lib/components/blocks/footer';
	import { Button } from '@/lib/components/ui/button';
	import { Badge } from '@/lib/components/ui/badge';
</script>

<svelte:head>
	<title>ATLANIZE - For Institutions</title>
	<meta
		name="description"
		content="Partner with ATLANIZE to transform your institution's repository into an AI-ready, semantically searchable knowledge base."
	/>
	<meta
		name="keywords"
		content="institution, university, B2B, ATLANIZE, ATLANIZER, AI-ready papers, embeddings, semantic search, academic repository"
	/>
	<meta name="author" content="ATLANIZE" />
</svelte:head>

<div class="flex flex-col min-h-[calc(100vh-4rem)] w-full bg-background">
	<!-- Hero Section -->
	<section
		class="flex flex-1 flex-col items-center justify-center px-6 py-20 md:py-32 text-center border-b border-border/40 max-w-4xl mx-auto"
	>
		<Badge class="mb-6 px-4 py-1.5 text-sm font-medium rounded-full" variant="secondary"
			>Partnership Program</Badge
		>
		<h1
			class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight text-foreground"
		>
			Make Your Institution's Research <span class="text-primary">AI-Ready</span>
		</h1>
		<p class="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
			Traditional repositories rely on titles, abstracts, and keywords. Partner with <strong
				>ATLANIZER</strong
			> to transform your journals through advanced embeddings, enabling researchers to discover your
			papers at the level of semantic meaning.
		</p>
		<div class="flex flex-col sm:flex-row gap-4">
			<Button size="lg" href="/contact" class="px-8 font-semibold">Contact for Partnership</Button>
		</div>
	</section>

	<!-- The Problem vs Solution Section -->
	<section class="py-24 px-6 md:px-12 container mx-auto max-w-6xl">
		<div class="grid md:grid-cols-2 gap-16 items-start">
			<div class="space-y-8">
				<h2 class="text-2xl font-bold tracking-tight border-b border-border/60 pb-4">
					The Limitation of Traditional Search
				</h2>
				<ul class="space-y-6">
					<li class="flex items-start gap-4">
						<div class="mt-1 text-muted-foreground">
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
								><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line
									x1="12"
									x2="12.01"
									y1="16"
									y2="16"
								/></svg
							>
						</div>
						<div>
							<strong class="block text-foreground mb-1 text-lg">Surface-Level Discovery</strong>
							<span class="text-muted-foreground text-base leading-relaxed"
								>Most academic repositories only index metadata like titles, keywords, abstracts,
								and citations. Critical insights buried deep within the text remain undiscoverable
								to researchers looking for specific methodologies or findings.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="mt-1 text-muted-foreground">
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
								><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line
									x1="12"
									x2="12.01"
									y1="16"
									y2="16"
								/></svg
							>
						</div>
						<div>
							<strong class="block text-foreground mb-1 text-lg">Missed Citations</strong>
							<span class="text-muted-foreground text-base leading-relaxed"
								>When researchers cannot find highly relevant papers due to keyword mismatches, your
								institution's valuable research loses potential impact and citation opportunities.</span
							>
						</div>
					</li>
				</ul>
			</div>

			<div class="space-y-8">
				<h2 class="text-2xl font-bold tracking-tight border-b border-border/60 pb-4 text-primary">
					The ATLANIZER Advantage
				</h2>
				<ul class="space-y-6">
					<li class="flex items-start gap-4">
						<div class="mt-1 text-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
							>
						</div>
						<div>
							<strong class="block text-foreground mb-1 text-lg">Deep Semantic Embeddings</strong>
							<span class="text-muted-foreground text-base leading-relaxed"
								>We process and convert the full text of your institution's journals into
								high-dimensional vector embeddings. This allows our AI to understand the actual
								meaning of the sentences, not just exact word matches.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="mt-1 text-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
							>
						</div>
						<div>
							<strong class="block text-foreground mb-1 text-lg">Context-Aware Discovery</strong>
							<span class="text-muted-foreground text-base leading-relaxed"
								>Researchers using ATLANIZE can discover your institution's papers based on complex
								queries, finding relevant paragraphs and arguments that perfectly match their
								research context.</span
							>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section class="py-24 px-6 md:px-12 bg-muted/20 border-y border-border/40">
		<div class="container mx-auto max-w-5xl">
			<div class="text-center mb-16">
				<h2 class="text-3xl font-bold tracking-tight mb-4">How the Partnership Works</h2>
				<p class="text-lg text-muted-foreground">
					A seamless integration to elevate your university's academic presence.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-6 relative">
				<!-- Step 1 -->
				<div
					class="flex flex-col items-center text-center p-8 border border-border/60 rounded-xl bg-background"
				>
					<div
						class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6"
					>
						1
					</div>
					<h3 class="font-bold text-xl mb-3">Integration</h3>
					<p class="text-base text-muted-foreground leading-relaxed">
						We securely connect to your university's existing journal repository or database.
					</p>
				</div>
				<!-- Step 2 -->
				<div
					class="flex flex-col items-center text-center p-8 border border-border/60 rounded-xl bg-background"
				>
					<div
						class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6"
					>
						2
					</div>
					<h3 class="font-bold text-xl mb-3">AI Processing</h3>
					<p class="text-base text-muted-foreground leading-relaxed">
						ATLANIZER chunks and embeds the full text of all papers, generating a semantic knowledge
						graph.
					</p>
				</div>
				<!-- Step 3 -->
				<div
					class="flex flex-col items-center text-center p-8 border border-border/60 rounded-xl bg-background"
				>
					<div
						class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6"
					>
						3
					</div>
					<h3 class="font-bold text-xl mb-3">Global Discovery</h3>
					<p class="text-base text-muted-foreground leading-relaxed">
						Your papers become instantly searchable by meaning to researchers worldwide using our
						platform.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-32 px-6 text-center container mx-auto max-w-4xl">
		<h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-6">
			Ready to empower your repository?
		</h2>
		<p class="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
			Join forward-thinking universities and institutions who are making their research globally
			accessible through AI.
		</p>
		<Button size="lg" href="/contact" variant="default" class="px-10 font-semibold"
			>Get in Touch</Button
		>
	</section>
</div>

<Footer />
