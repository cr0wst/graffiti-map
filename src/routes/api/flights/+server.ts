import type { ServerLoadEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }: ServerLoadEvent) {
	const { db } = locals;
	const limit = parseInt(url.searchParams.get('limit') ?? '100');
	const response = await db.query(
		`
		SELECT
	f.name,
	f.callsign,
	f.departure,
	d.resp_artcc_id AS departure_artcc,
	f.arrival,
	a.resp_artcc_id AS arrival_artcc,
	f.created_at AS arrived_at,
	f.departure_color
FROM
	flights_archive f
	JOIN airports a ON LTRIM(f.arrival, 'K') = a.arpt_id
	JOIN airports d ON LTRIM(f.departure, 'K') = d.arpt_id
WHERE
	departure_color IS NOT NULL AND a.resp_artcc_id <> d.resp_artcc_id
ORDER BY
	f.created_at DESC LIMIT $1;
`,
		[limit ?? 100]
	);

	// get total flights
	const totalFlights = await db.query('SELECT COUNT(*) FROM flights_archive');

	return json({ flights: response.rows, count: totalFlights.rows[0].count });
}
