import type { ServerLoadEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }: ServerLoadEvent) {
	const { db } = locals;

	const totalFlights = await db.query('SELECT COUNT(*) FROM flights_archive');

	const limit = parseInt(url.searchParams.get('limit') ?? '100');
	const response = await db.query(
		`
	SELECT
    artcc,
    SUM(completed_departures) AS completed_departures,
    SUM(completed_arrivals) AS completed_arrivals,
    SUM(departures) AS expected_departures,
    SUM(arrivals) AS expected_arrivals
FROM (
    SELECT
        d.resp_artcc_id AS artcc,
        COUNT(*) AS completed_departures,
        0 AS completed_arrivals,
        0 AS departures,
        0 AS arrivals
    FROM
        flights_archive f
        JOIN airports d ON d.arpt_id = ltrim(f.departure, 'K')
    GROUP BY
        1

    UNION ALL

    SELECT
        a.resp_artcc_id AS artcc,
        0 AS completed_departures,
        COUNT(*) AS completed_arrivals,
        0 AS departures,
        0 AS arrivals
    FROM
        flights_archive f
        JOIN airports a ON a.arpt_id = ltrim(f.arrival, 'K')
    GROUP BY
        1

    UNION ALL

    SELECT
        d.resp_artcc_id AS artcc,
        0 AS completed_departures,
        0 AS completed_arrivals,
        COUNT(*) AS departures,
        0 AS arrivals
    FROM
        flight_status f
        JOIN airports d ON d.arpt_id = ltrim(f.departure, 'K')
    GROUP BY
        1

    UNION ALL

    SELECT
        a.resp_artcc_id AS artcc,
        0 AS completed_departures,
        0 AS completed_arrivals,
        0 AS departures,
        COUNT(*) AS arrivals
    FROM
        flight_status f
        JOIN airports a ON a.arpt_id = ltrim(f.arrival, 'K')
    GROUP BY
        1
) AS combined_data
GROUP BY
    artcc;

	`
	);

	// convert array of objects to single object
	const artccFlights = response.rows.reduce((acc, cur) => {
		acc[cur.artcc] = {
			completed: { departures: cur.completed_departures, arrivals: cur.completed_arrivals },
			expected: {
				departures: cur.expected_departures,
				arrivals: cur.expected_arrivals
			}
		};
		return acc;
	}, {});
	return json(artccFlights);
}
