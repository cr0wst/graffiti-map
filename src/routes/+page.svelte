<script lang="ts">
	import Map from '$lib/map/Map.svelte';
	import Header from '$lib/Header.svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	export let data;

	$: stats = data.stats;
	$: boundaries = data.boundaries;
	$: flights = data.flights;

	let colorMap = {
		blue: {
			thickBorder: 'border-blue-500',
			thinBorder: 'border-blue-500',
			background: 'bg-blue-900'
		},
		green: {
			thickBorder: 'border-green-500',
			thinBorder: 'border-green-500',
			background: 'bg-green-900'
		},
		red: {
			thickBorder: 'border-red-500',
			thinBorder: 'border-red-500',
			background: 'bg-red-900'
		},
		gray: {
			thickBorder: 'border-zinc-300',
			thinBorder: 'border-zinc-300',
			background: 'bg-zinc-500'
		}
	};

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('app:loadData');
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<Header />

<div class="flex-1 flex w-full" id="content">
	<Map {stats} {boundaries} />
</div>
<div class="w-full flex-col md:flex-row flex items-center justify-center">
	<div class="md:w-1/6 p-2 flex items-center justify-center">
		<h1 class="text-md graffiti-text">Tracked Landings</h1>
	</div>
	<div class="w-full md:flex-grow flex-col flex md:flex-row m-auto">
		{#each flights.slice(0, 4) as flight}
			<div
				class="h-8 border {colorMap[flight.departure_color].thinBorder} {colorMap[
					flight.departure_color
				].background} h-fit p-1 m-1 w-full md:w-1/4 flex items-center justify-center"
			>
				<div
					class="border-r-4 m-1 w-1/2 text-white font-semibold text-sm {colorMap[
						flight.departure_color
					].thickBorder}"
				>
					{flight.callsign}
					<div class="text-xs font-extralight text-white">
						{moment.utc(flight.arrived_at).fromNow()}
					</div>
				</div>
				<div class="flex items-center justify-center text-sm text-white w-1/2">
					<div class="w-1/2 text-center flex flex-col items-center justify-center">
						<span>{flight.departure}</span>
						<span class="text-xs font-thin">{flight.departure_artcc}</span>
					</div>
					<div class="w-1/2 text-center flex flex-col items-center justify-center">
						<span>{flight.arrival}</span>
						<span class="text-xs font-thin">{flight.arrival_artcc}</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
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
