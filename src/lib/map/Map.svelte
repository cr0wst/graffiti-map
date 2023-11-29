<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import PlaneIcon from '$lib/plane.svg?raw';

	import { browser } from '$app/environment';
	import { calculateColor, calculateIconColor } from '$lib/color';

	let mapElement;
	let map;
	let leaflet;
	let geoJsonLayer;
	let flightLayer;
	let greenPlaneIcon;
	let bluePlaneIcon;
	let redPlaneIcon;
	let grayPlaneIcon;

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

			greenPlaneIcon = leaflet.divIcon({
				html: `${PlaneIcon}`,
				iconSize: [20, 20],
				className: 'svg-icon-green'
			});

			bluePlaneIcon = leaflet.divIcon({
				html: `${PlaneIcon}`,
				iconSize: [20, 20],
				className: 'svg-icon-blue'
			});

			redPlaneIcon = leaflet.divIcon({
				html: `${PlaneIcon}`,
				iconSize: [20, 20],
				className: 'svg-icon-red'
			});

			grayPlaneIcon = leaflet.divIcon({
				html: `${PlaneIcon}`,
				iconSize: [20, 20],
				className: 'svg-icon-gray'
			});

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

			if (flightLayer && flightLayer.length > 0) {
				flightLayer.forEach((fl) => map.removeLayer(fl));
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

			flightLayer = flights.map((f) => {
				const color = calculateIconColor({
					red: f.departure_red_units,
					green: f.departure_green_units,
					blue: f.departure_blue_units
				});

				// Calculate angle between current location and destination in degrees
				const angle = Math.floor(
					(Math.atan2(
						f.arrival_latitude - f.flight_latitude,
						f.arrival_longitude - f.flight_longitude
					) *
						180) /
						Math.PI
				);

				const marker = leaflet
					.marker([f.flight_latitude, f.flight_longitude], {
						icon:
							color === 'gray'
								? grayPlaneIcon
								: color === 'red'
								  ? redPlaneIcon
								  : color === 'green'
								    ? greenPlaneIcon
								    : bluePlaneIcon,
						rotationAngle: angle
					})
					.addTo(map);

				return marker;
			});
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

	:global(.svg-icon-green path) {
		fill: #00ff00;
	}

	:global(.svg-icon-blue path) {
		fill: #0000ff;
	}

	:global(.svg-icon-red path) {
		fill: #ff0000;
	}

	:global(.svg-icon-gray path) {
		fill: #cccccc;
	}

	:global(.rotate-test svg) {
		transform: rotate(45deg);
	}
</style>
