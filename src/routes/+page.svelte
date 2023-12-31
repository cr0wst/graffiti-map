<script lang="ts">
	import Map from '$lib/map/Map.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import CompletedFlightStripBay from '$lib/CompletedFlightStripBay.svelte';
	import { selectedArtcc, selectedPlane } from '$lib/stores';

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
		}, 1000 * 60);

		return () => clearInterval(interval);
	});
</script>

<div class="z-0 flex-1 flex w-full" id="content">
	<Map {stats} {boundaries} flights={activeFlights.flights} />
</div>
{#if $selectedArtcc}
	<div
		class="z-40 w-full flex-col md:w-1/2 h-fit absolute top-14 md:top-20 left-1/2 transform -translate-x-1/2 flex border-y md:border border-white bg-zinc-800"
	>
		<!-- top thing -->
		<div class="w-full flex border-b">
			<div
				class="w-1/2 flex items-center justify-center"
				style="background-color: {calculateColor({
					blue: $selectedArtcc.blue,
					green: $selectedArtcc.green,
					red: $selectedArtcc.red
				})};"
			>
				<h1 class="text-lg font-semibold text-white">{$selectedArtcc.id}</h1>
			</div>
			<div class="w-1/2 h-full flex items-center justify-center font-semibold text-lg text-white">
				<div
					class="w-1/3 p-1 border text-center items-center justify-center flex h-full border-red-500 bg-red-900"
				>
					{$selectedArtcc.red}
				</div>
				<div
					class="w-1/3 p-1 border flex h-full text-center items-center justify-center border-green-500 bg-green-900"
				>
					{$selectedArtcc.green}
				</div>
				<div
					class="w-1/3 p-1 border flex h-full text-center items-center justify-center border-blue-500 bg-blue-900"
				>
					{$selectedArtcc.blue}
				</div>
			</div>
		</div>
		<!-- bottom thing -->
		<div class="w-full flex items-center justify-center p-1 bg-zinc-700">
			<div class="w-1/2 flex border-r border-r-white">
				<div class="pl-2 text-white font-light text-lg">Completed</div>
				<div class="w-1/2 flex justify-center items-center fill-white">
					<div class="w-4">{@html DepartingPlaneIcon}</div>
					<div class="pl-2 text-white font-semibold text-md">
						{artccFlights[$selectedArtcc.id]?.completed.departures ?? 0}
					</div>
				</div>
				<div class="w-1/2 flex justify-center items-center fill-white">
					<div class="w-4 rotate-90">{@html DepartingPlaneIcon}</div>
					<div class="pl-2 text-white font-semibold text-md">
						{artccFlights[$selectedArtcc.id]?.completed.arrivals ?? 0}
					</div>
				</div>
			</div>
			<div class="w-1/2 flex">
				<div class="pl-2 text-white font-light text-lg">Expected</div>
				<div class="w-1/2 flex justify-center items-center fill-white">
					<div class="w-4">{@html DepartingPlaneIcon}</div>
					<div class="pl-2 text-white font-semibold text-md">
						{artccFlights[$selectedArtcc.id]?.expected.departures ?? 0}
					</div>
				</div>
				<div class="w-1/2 flex justify-center items-center fill-white">
					<div class="w-4 rotate-90">{@html DepartingPlaneIcon}</div>
					<div class="pl-2 text-white font-semibold text-md">
						{artccFlights[$selectedArtcc.id]?.expected.arrivals ?? 0}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if $selectedPlane}
	<div
		class="z-40 w-full flex-col md:w-1/2 h-fit absolute top-14 md:top-20 left-1/2 transform -translate-x-1/2 flex items-center justify-center border-y md:border border-white bg-zinc-800"
	>
		<!-- top thing -->
		<div
			class="w-full flex justify-center"
			style="background-color: {calculateColor({
				blue: $selectedPlane.departure_blue_units,
				green: $selectedPlane.departure_green_units,
				red: $selectedPlane.departure_red_units
			})}"
		>
			<div class="w-full flex justify-center text-white">
				<div class="w-1/2 h-full flex-shrink flex justify-center text-lg font-semibold border-r">
					{$selectedPlane.callsign}
				</div>
				<div class="w-1/2 flex bg-zinc-700 h-full">
					<div class="w-1/2 flex justify-center items-center fill-white">
						<div class="w-4">{@html DepartingPlaneIcon}</div>
						<div class="pl-2 text-white font-semibold text-md">
							{$selectedPlane.departure_airport}
						</div>
					</div>
					<div class="w-1/2 flex justify-center items-center fill-white">
						<div class="w-4 rotate-90">{@html DepartingPlaneIcon}</div>
						<div class="pl-2 text-white font-semibold text-md">
							{$selectedPlane.arrival_airport}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="w-full flex-col md:flex-row flex items-center justify-center">
	<CompletedFlightStripBay {completedFlights} />
</div>

<div
	class="w-full bg-zinc-900 flex flex-col items-center justify-center p-2 text-xs font-thin text-zinc-400"
>
	<div>
		GraffitiAir &copy; {new Date().getFullYear()}
		<a href="https://github.com/cr0wst" class="text-white hover:text-zinc-400"
			>Steve Crow (cr0wst)</a
		>
	</div>
</div>
