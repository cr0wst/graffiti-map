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
	let flightClickedLayer = [];

	let iconMap;

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

			iconMap = {
				green: leaflet.divIcon({
					html: `${PlaneIcon}`,
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					className: 'svg-icon-green'
				}),
				blue: leaflet.divIcon({
					html: `${PlaneIcon}`,
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					className: 'svg-icon-blue'
				}),
				red: leaflet.divIcon({
					html: `${PlaneIcon}`,
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					className: 'svg-icon-red'
				}),
				gray: leaflet.divIcon({
					html: `${PlaneIcon}`,
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					className: 'svg-icon-gray'
				}),
				'red-green': leaflet.divIcon({
					html: `${PlaneIcon}`,
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					className: 'svg-icon-red-green'
				}),
				'red-blue': leaflet.divIcon({
					html: `${PlaneIcon}`,
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					className: 'svg-icon-red-blue'
				}),
				'green-blue': leaflet.divIcon({
					html: `${PlaneIcon}`,
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					className: 'svg-icon-green-blue'
				}),
				'red-green-blue': leaflet.divIcon({
					html: `${PlaneIcon}`,
					iconSize: [20, 20],
					iconAnchor: [10, 10],
					className: 'svg-icon-red-green-blue'
				})
			};

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

			if (flightClickedLayer && flightClickedLayer.length > 0) {
				flightClickedLayer.forEach((fl) => map.removeLayer(fl));
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
				const iconColor = calculateIconColor({
					red: f.departure_red_units,
					green: f.departure_green_units,
					blue: f.departure_blue_units
				});

				const lineColor = calculateColor({
					red: f.departure_red_units,
					green: f.departure_green_units,
					blue: f.departure_blue_units
				});

				const marker = leaflet
					.marker([f.flight_latitude, f.flight_longitude], {
						icon: iconMap[iconColor],
						rotationAngle: f.flight_heading,
						rotationOrigin: 'center',
						interactive: true
					})
					.addTo(map)
					.on('mouseout', () => {
						flightClickedLayer.forEach((fl) => map.removeLayer(fl));
					})
					.on('mouseover', () => {
						flightClickedLayer.push(
							leaflet
								.circleMarker([f.departure_latitude, f.departure_longitude], {
									color: lineColor,
									radius: 2,
									interactive: false
								})
								.addTo(map)
						);
						flightClickedLayer.push(
							leaflet
								.circleMarker([f.arrival_latitude, f.arrival_longitude], {
									color: lineColor,
									radius: 2,
									interactive: false
								})
								.addTo(map)
						);
						flightClickedLayer.push(
							leaflet
								.polyline(
									[
										[f.departure_latitude, f.departure_longitude],
										[f.flight_latitude, f.flight_longitude],
										[f.arrival_latitude, f.arrival_longitude]
									],
									{
										color: lineColor,
										weight: 2,
										opacity: 1,
										interactive: false
									}
								)
								.addTo(map)
						);
					});
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

	:global(.svg-icon-red-green path) {
		fill: #ffff00;
	}

	:global(.svg-icon-red-blue path) {
		fill: #ff00ff;
	}

	:global(.svg-icon-green-blue path) {
		fill: #00ffff;
	}

	:global(.svg-icon-red-green-blue path) {
		fill: #494949;
	}
</style>
