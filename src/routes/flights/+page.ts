import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends('app:loadData');

	return {
		completedFlights: (await fetchCompletedFlights(fetch)).flights
	};
};

async function fetchCompletedFlights(fetch: typeof window.fetch) {
	return await fetch('/api/completedFlights?limit=50').then((r) => r.json());
}
