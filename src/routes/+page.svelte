<script lang="ts">
	import Map from '$lib/map/Map.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import CompletedFlightStripBay from '$lib/CompletedFlightStripBay.svelte';
	import { selectedArtcc } from '$lib/stores';

	import DepartingPlaneIcon from '$lib/departing-plane-icon.svg?raw';
	import { calculateColor } from '$lib/color';

	export let data;

	$: stats = data.stats;
	$: boundaries = data.boundaries;
	$: completedFlights = data.completedFlights;
	$: activeFlights = data.activeFlights;
	$: artccFlights = data.artccFlights;

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('app:loadData');
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="z-0 flex-1 flex w-full" id="content">
	<Map {stats} {boundaries} flights={activeFlights.flights} />
</div>
{#if $selectedArtcc}
	<div
		class="z-40 w-full md:w-1/2 h-10 absolute top-14 md:top-20 left-1/2 transform -translate-x-1/2 flex items-center justify-center border-y md:border border-white bg-zinc-800"
	>
		<div
			class="w-1/3 h-full flex items-center justify-center"
			style="background-color: {calculateColor({
				blue: $selectedArtcc.blue,
				green: $selectedArtcc.green,
				red: $selectedArtcc.red
			})};"
		>
			<h1 class="text-2xl font-semibold text-white">{$selectedArtcc.id}</h1>
		</div>
		<div class="w-1/3 h-full flex font-semibold text-xl text-white">
			<div
				class="w-1/3 border text-center items-center justify-center flex h-full border-red-500 bg-red-900"
			>
				{$selectedArtcc.red}
			</div>
			<div
				class="w-1/3 border flex h-full text-center items-center justify-center border-green-500 bg-green-900"
			>
				{$selectedArtcc.green}
			</div>
			<div
				class="w-1/3 border flex h-full text-center items-center justify-center border-blue-500 bg-blue-900"
			>
				{$selectedArtcc.blue}
			</div>
		</div>
		<div class="w-1/3 flex">
			<div class="w-1/2 flex justify-center items-center fill-white">
				<div class="w-6">{@html DepartingPlaneIcon}</div>
				<div class="pl-2 text-white font-semibold text-xl">
					{artccFlights[$selectedArtcc.id]?.departures ?? 0}
				</div>
			</div>
			<div class="w-1/2 flex justify-center items-center fill-white">
				<div class="w-6 rotate-90">{@html DepartingPlaneIcon}</div>
				<div class="pl-2 text-white font-semibold text-xl">
					{artccFlights[$selectedArtcc.id]?.arrivals ?? 0}
				</div>
			</div>
		</div>
	</div>
{/if}
<div class="w-full flex-col md:flex-row flex items-center justify-center">
	<CompletedFlightStripBay {completedFlights} />
</div>
