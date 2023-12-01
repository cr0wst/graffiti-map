import type { ServerLoadEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }: ServerLoadEvent) {
	const { db } = locals;

	const totalFlights = await db.query('SELECT COUNT(*) FROM flights_archive');

	const limit = parseInt(url.searchParams.get('limit') ?? '100');
	const response = await db.query(
		`
	SELECT
	d.artcc,
	d.count AS departures,
	a.count AS arrivals
FROM (
	SELECT
		d.resp_artcc_id AS artcc,
		count(*)
	FROM
		flights_archive f
		JOIN airports d ON d.arpt_id = ltrim(f.departure, 'K')
	GROUP BY
		1) d
	JOIN (
		SELECT
			a.resp_artcc_id AS artcc,
			count(*)
		FROM
			flights_archive f
			JOIN airports a ON a.arpt_id = ltrim(f.arrival, 'K')
		GROUP BY
			1) a ON d.artcc = a.artcc;
	`
	);

	// convert array of objects to single object
	const artccFlights = response.rows.reduce((acc, cur) => {
		acc[cur.artcc] = { departures: cur.departures, arrivals: cur.arrivals };
		return acc;
	}, {});
	return json(artccFlights);
}
