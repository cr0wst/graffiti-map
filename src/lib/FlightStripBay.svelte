<script lang="ts">
	import FlightStrip from '$lib/FlightStrip.svelte';

	export let flights;
</script>

<div class="w-full md:flex-grow flex-col flex md:flex-row m-auto">
	{#each flights.slice(0, 4) as flight}
		<FlightStrip {flight} />
	{/each}
</div>
