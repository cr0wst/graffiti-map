import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends('app:loadData');

	return {
		flightsCount: (await fetchFlightsCount(fetch)).count
	};
};

async function fetchFlightsCount(fetch: typeof window.fetch) {
	return await fetch('/api/flights?limit=0').then((r) => r.json());
}
