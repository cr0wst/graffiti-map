<script>
	import '../app.css';
	import Header from '$lib/Header.svelte';
	export let data;

	$: count = data.completedFlightsCount ?? 0;
</script>

<div class="min-h-screen flex flex-col">
	<Header {count} />
	<slot />
</div>
