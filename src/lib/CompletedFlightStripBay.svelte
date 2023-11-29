<script lang="ts">
	import CompletedFlightStrip from '$lib/CompletedFlightStrip.svelte';

	export let completedFlights;
</script>

<div class="w-full md:flex-grow flex-col flex md:flex-row m-auto">
	{#each completedFlights.slice(0, 4) as flight}
		<CompletedFlightStrip {flight} />
	{/each}
</div>
