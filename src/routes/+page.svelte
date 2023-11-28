<script lang="ts">
	import Map from '$lib/map/Map.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import FlightStripBay from '$lib/FlightStripBay.svelte';

	export let data;

	$: stats = data.stats;
	$: boundaries = data.boundaries;
	$: flights = data.flights;

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('app:loadData');
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex-1 flex w-full" id="content">
	<Map {stats} {boundaries} />
</div>
<div class="w-full flex-col md:flex-row flex items-center justify-center">
	<div class="md:w-1/6 p-2 flex items-center justify-center">
		<h1 class="text-md graffiti-text">Tracked Landings</h1>
	</div>
	{#if flights && flights.length > 0}
		<FlightStripBay {flights} />
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
