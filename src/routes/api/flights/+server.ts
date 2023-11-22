import type { ServerLoadEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function GET({ params, locals }: ServerLoadEvent) {
	const { db } = locals;
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
	departure_color IS NOT NULL
ORDER BY
	f.created_at DESC
LIMIT 10`
	);

	return json(response.rows);
}
