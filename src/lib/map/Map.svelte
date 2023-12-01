<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import PlaneIcon from '$lib/map/plane.svg?raw';
	import { selectedArtcc } from '$lib/stores';
	import { browser } from '$app/environment';
	import { calculateColor } from '$lib/color';

	let mapElement;
	let map;
	let leaflet;
	let geoJsonLayer;
	let flightLayer;

	export let stats;
	export let flights = [];

	$: if (stats) {
		updateMap();
	}
	export let boundaries;

	onMount(async () => {
		if (browser) {
			leaflet = await import('leaflet');
			await import('leaflet-rotatedmarker');

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
		}
	});

	onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});

	function updateMap() {
		if (leaflet && map) {
			updateGeoJsonLayer();
			updateFlightLayer();
		}
	}

	function updateFlightLayer() {
		if (flightLayer && flightLayer.length > 0) {
			flightLayer.forEach((fl) => map.removeLayer(fl));
		}

		flightLayer = flights.map((f) => {
			const color = calculateColor({
				red: f.departure_red_units,
				green: f.departure_green_units,
				blue: f.departure_blue_units
			});

			return leaflet
				.marker([f.flight_latitude, f.flight_longitude], {
					icon: leaflet.divIcon({
						html: `<div class="plane-icon" style="--fill-color: ${color}">${PlaneIcon}</div>`,
						iconSize: [20, 20],
						iconAnchor: [10, 10],
						className: ''
					}),
					rotationAngle: f.flight_heading,
					rotationOrigin: 'center',
					interactive: true
				})
				.addTo(map);
		});
	}

	function updateGeoJsonLayer() {
		if (geoJsonLayer) {
			map.removeLayer(geoJsonLayer);
		}

		geoJsonLayer = leaflet
			.geoJson(boundaries, {
				style: (feature) => {
					const color = stats[feature.properties.id]
						? stats[feature.properties.id].color
						: '#cccccc';
					return {
						fillColor: color,
						weight: feature.properties.id == $selectedArtcc?.id ? 3 : 1,
						opacity: 1,
						color: 'white',
						fillOpacity: feature.properties.id == $selectedArtcc?.id ? 0.8 : 0.4
					};
				}
			})
			.addTo(map)
			.on('click', (e) => {
				const artcc = {
					id: e.layer.feature.properties.id,
					red: stats[e.layer.feature.properties.id].red,
					green: stats[e.layer.feature.properties.id].green,
					blue: stats[e.layer.feature.properties.id].blue
				};
				$selectedArtcc = $selectedArtcc !== null && $selectedArtcc.id === artcc.id ? null : artcc;
				updateMap();
			});
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

	:global(.plane-icon > svg > path) {
		fill: var(--fill-color);
	}
</style>
