import type { ServerLoadEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }: ServerLoadEvent) {
	const { db } = locals;
	const response = await db.query(
		'SELECT name, callsign, departure, arrival, created_at as arrived_at, departure_color FROM flights_archive WHERE departure_color IS NOT null ORDER BY created_at DESC LIMIT 10'
	);

	return json(response.rows);
}
