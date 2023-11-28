<script lang="ts">
	import FlightStrip from '$lib/FlightStrip.svelte';

	export let data;

	$: flights = data.flights;
</script>

<div class="container mx-auto px-8 py-3 w-full text-white">
	<h1 class="text-4xl font-bold mb-4">Recently Tracked Flights</h1>

	{#if flights.length === 0}
		<p class="text-xl">No flights have been tracked yet.</p>
	{:else}
		<div class="flex flex-wrap w-full items-center justify-center">
			{#each flights as flight}
				<FlightStrip {flight} />
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
