<script lang="ts">
	import CompletedFlightStrip from '$lib/CompletedFlightStrip.svelte';

	export let completedFlights;
</script>

<div class="md:w-1/6 p-2 flex flex-col items-center justify-center">
	<h1 class="text-md graffiti-text">Completed Flights</h1>
	<p class="text-white text-sm font-thin">
		<span class="font-semibold">{completedFlights.count}</span> and counting!
	</p>
</div>
<div class="w-full md:flex-grow flex-col flex md:flex-row m-auto">
	{#each completedFlights.flights.slice(0, 4) as flight}
		<CompletedFlightStrip {flight} />
	{/each}
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
