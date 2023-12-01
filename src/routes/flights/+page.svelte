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
