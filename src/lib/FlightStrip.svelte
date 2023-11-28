<script lang="ts">
	import moment from 'moment';

	export let flight;

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
</script>

<div
	class="h-8 border {colorMap[flight.departure_color].thinBorder} {colorMap[flight.departure_color]
		.background} h-fit p-1 m-1 w-full md:w-1/4 flex items-center justify-center"
>
	<div
		class="border-r-4 m-1 w-1/2 text-white font-semibold text-sm {colorMap[flight.departure_color]
			.thickBorder}"
	>
		{flight.callsign}
		<div class="text-xs font-extralight text-white">
			{moment.utc(flight.arrived_at).fromNow()}
		</div>
	</div>
	<div class="flex items-center justify-center text-sm text-white w-1/2">
		<div class="w-1/2 text-center flex flex-col items-center justify-center">
			<span>{flight.departure}</span>
			<span class="text-xs font-thin">{flight.departure_artcc.substring(1, 4)}</span>
		</div>
		<div class="w-1/2 text-center flex flex-col items-center justify-center">
			<span>{flight.arrival}</span>
			<span class="text-xs font-thin">{flight.arrival_artcc.substring(1, 4)}</span>
		</div>
	</div>
</div>
