import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends('app:loadData');

	return {
		flights: (await fetchFlights(fetch)).flights
	};
};

async function fetchFlights(fetch: typeof window.fetch) {
	return await fetch('/api/flights?limit=50').then((r) => r.json());
}
