import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = async ({ fetch, depends }: PageLoadEvent) => {
	depends('app:loadData');

	return {
		completedFlightsCount: (await fetchCompletedFlightsCount(fetch)).count
	};
};

async function fetchCompletedFlightsCount(fetch: typeof window.fetch) {
	return await fetch('/api/completedFlights?limit=0').then((r) => r.json());
}
