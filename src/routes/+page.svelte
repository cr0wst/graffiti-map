<script lang="ts">
	import Map from '$lib/map/Map.svelte';
	import Header from '$lib/Header.svelte';
	import moment from 'moment';

	export let data;
	const { stats, boundaries, flights } = data;
</script>

<Header />

<div class="flex-1 flex" id="content">
	<Map {stats} {boundaries} />
</div>
<div class="w-full flex-col flex md:flex-row m-auto">
	{#each flights.slice(0, 4) as flight}
		<div
			class="h-8 border border-zinc-500 bg-zinc-700 h-fit p-1 m-1 w-full md:w-1/4 flex items-center justify-center"
		>
			<div class="border-r-4 border-white m-1 w-1/2 text-white font-semibold text-sm">
				{flight.callsign}
				<div class="text-xs font-extralight text-white">
					{moment.utc(flight.arrived_at).fromNow()}
				</div>
			</div>
			<div class="flex items-center justify-center text-sm text-white w-1/2">
				<div class="w-1/2 text-center">{flight.departure}</div>
				<div class="w-1/2 text-center">{flight.arrival}</div>
			</div>
		</div>
	{/each}
</div>

<style>
</style>
