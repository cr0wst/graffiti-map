<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { browser } from '$app/environment';

	let mapElement;
	let map;
	let leaflet;
	let geoJsonLayer;

	export let stats;

	$: if (stats) {
		updateMap();
	}
	export let boundaries;

	onMount(async () => {
		if (browser) {
			leaflet = await import('leaflet');
			map = leaflet.map(mapElement, {
				center: [37.8, -96],
				zoom: 4,
				zoomControl: false
			});

			leaflet
				.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
					minZoom: 0,
					maxZoom: 20,
					attribution:
						'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					ext: 'png'
				})
				.addTo(map);

			updateMap();

			geoJsonLayer.addTo(map);
		}
	});

	onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});
	function updateMap() {
		if (leaflet && map) {
			if (geoJsonLayer) {
				map.removeLayer(geoJsonLayer);
			}
			geoJsonLayer = leaflet
				.geoJson(boundaries, {
					style: style,
					onEachFeature: (feature, layer) => {
						const stat = stats[feature.properties.id];
						if (stat) {
							layer.bindTooltip(
								`
                                <h3>${feature.properties.id.substring(1, 4)}</h3>
                                <p>🟥 ${stat.red} 🟩 ${stat.green} 🟦 ${stat.blue}</p>
                            `,
								{
									direction: 'center',
									bubblingMouseEvents: false
								}
							);
						}
					}
				})
				.addTo(map);
		}
	}

	function style(feature) {
		const color = stats[feature.properties.id] ? stats[feature.properties.id].color : '#cccccc';
		return {
			fillColor: color,
			weight: 2,
			opacity: 1,
			color: 'white',
			fillOpacity: 0.5
		};
	}
</script>

<div bind:this={mapElement} id="map"></div>

<style>
	@import 'leaflet/dist/leaflet.css';

	#map {
		flex: 1;
	}

	:global(path.leaflet-interactive:focus) {
		outline: none;
	}
</style>
