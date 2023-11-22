import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends('app:loadData');

	return {
		stats: await fetchStats(fetch),
		boundaries: await fetchBoundaries(fetch),
		flights: await fetchFlights(fetch)
	};
};

async function fetchStats(fetch: typeof window.fetch) {
	return await fetch('/api/stats').then((r) => r.json());
}

async function fetchBoundaries(fetch: typeof window.fetch) {
	const boundaries = await fetch('../map/Boundaries.geojson').then((r) => r.json());
	boundaries.features = boundaries.features.filter(
		(f: any) =>
			// Only US ARTCCs for now
			f.properties.division === 'VATUSA' &&
			// Ignore Oceanic
			f.properties.oceanic === '0' &&
			// Only Continental US
			f.properties.id.startsWith('K') &&
			!f.properties.id.includes('-')
	);

	return boundaries;
}

async function fetchFlights(fetch: typeof window.fetch) {
	return await fetch('/api/flights').then((r) => r.json());
}
