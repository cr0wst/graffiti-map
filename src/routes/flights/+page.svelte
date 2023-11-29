<script lang="ts">
	import CompletedFlightStrip from '$lib/CompletedFlightStrip.svelte';

	export let data;

	$: completedFlights = data.completedFlights;
</script>

<div class="container mx-auto px-8 py-3 w-full text-white">
	<h1 class="text-4xl font-bold mb-4">Recently Completed Flights</h1>

	{#if completedFlights.length === 0}
		<p class="text-xl">No flights have been tracked yet.</p>
	{:else}
		<div class="flex flex-wrap w-full items-center justify-center">
			{#each completedFlights as flight}
				<CompletedFlightStrip {flight} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.graffiti-text {
		background: linear-gradient(
			90deg,
			rgb(48, 181, 64) 10%,
			rgb(214, 0, 14) 30%,
			rgb(133, 2, 221) 70%,
			rgb(48, 199, 255) 80%
		);
		-webkit-background-clip: text;
		color: transparent;
	}
</style>
