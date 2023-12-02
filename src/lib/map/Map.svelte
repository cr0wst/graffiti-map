<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import PlaneIcon from '$lib/map/plane.svg?raw';
	import { selectedArtcc, selectedPlane } from '$lib/stores';
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

			map.on('click', () => {
				$selectedArtcc = null;
				$selectedPlane = null;
				updateMap();
			});
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

			// add some transparency if the plane is not selected
			return leaflet
				.marker([f.flight_latitude, f.flight_longitude], {
					icon: leaflet.divIcon({
						html: `<div class="plane-icon" style="--fill-color: ${color}">${PlaneIcon}</div>`,
						iconSize: [10, 10],
						iconAnchor: [5, 5],
						className: ''
					}),
					rotationAngle: f.flight_heading,
					rotationOrigin: 'center',
					interactive: true,
					opacity: $selectedPlane == null || $selectedPlane.callsign === f.callsign ? 1 : 0.5
				})
				.addTo(map)
				.on('click', (e) => {
					leaflet.DomEvent.stopPropagation(e);
					selectedArtcc.set(null);
					$selectedPlane =
						$selectedPlane !== null && $selectedPlane.callsign === f.callsign ? null : f;

					updateMap();
				});
		});

		// add lines between flight, departure, and arrival for $selectedPlane
		if ($selectedPlane) {
			const departureColor = calculateColor({
				red: $selectedPlane.departure_red_units,
				green: $selectedPlane.departure_green_units,
				blue: $selectedPlane.departure_blue_units
			});

			flightLayer.push(
				leaflet
					.circle([$selectedPlane.departure_latitude, $selectedPlane.departure_longitude], {
						radius: 100,
						color: departureColor,
						opacity: 0.5,
						weight: 1,
						interactive: false
					})
					.addTo(map),

				leaflet
					.circle([$selectedPlane.arrival_latitude, $selectedPlane.arrival_longitude], {
						radius: 100,
						color: departureColor,
						opacity: 0.5,
						weight: 1,
						interactive: false
					})
					.addTo(map),

				leaflet
					.polyline(
						[
							[$selectedPlane.departure_latitude, $selectedPlane.departure_longitude],
							[$selectedPlane.flight_latitude, $selectedPlane.flight_longitude],
							[$selectedPlane.arrival_latitude, $selectedPlane.arrival_longitude]
						],
						{
							color: departureColor,
							opacity: 1,
							weight: 2,
							interactive: false
						}
					)
					.addTo(map)
			);
		}
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

					const weight =
						$selectedPlane?.departure_artcc == feature.properties.id ||
						$selectedPlane?.arrival_artcc == feature.properties.id ||
						feature.properties.id == $selectedArtcc?.id
							? 3
							: 1;

					// If there's a plane selected we set the opacity to the departure and arrival artcc to .8 and all others to .2
					// if there's no plane selected but a territory is selected, we also set it to .8 and all others to .2
					// otherwise .6
					const fillOpacity = $selectedPlane
						? $selectedPlane.departure_artcc == feature.properties.id ||
						  $selectedPlane.arrival_artcc == feature.properties.id
							? 0.6
							: 0.1
						: $selectedArtcc
						  ? $selectedArtcc.id == feature.properties.id
								? 0.6
								: 0.1
						  : 0.3;
					return {
						fillColor: color,
						// set the weight to 3 if the plane is selected and this is a departure or arrival artcc
						weight: weight,
						opacity: 1,
						color: 'white',
						// set fill opacity to .2 if there's a plane selected
						fillOpacity: fillOpacity
					};
				}
			})
			.addTo(map)
			.on('click', (e) => {
				leaflet.DomEvent.stopPropagation(e);
				const artcc = {
					id: e.layer.feature.properties.id,
					red: stats[e.layer.feature.properties.id].red,
					green: stats[e.layer.feature.properties.id].green,
					blue: stats[e.layer.feature.properties.id].blue
				};
				$selectedArtcc = $selectedArtcc !== null && $selectedArtcc.id === artcc.id ? null : artcc;
				selectedPlane.set(null);
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
