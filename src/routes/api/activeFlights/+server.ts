import type { ServerLoadEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }: ServerLoadEvent) {
	const { db } = locals;
	const response = await db.query(
		`
		SELECT
	f.cid as "cid",
	f.name as "name",
	f.callsign as "callsign",
	f.longitude as "flight_longitude",
	f.latitude as "flight_latitude",
	f.heading as "flight_heading",
	d.resp_artcc_id as "departure_artcc",
	d.arpt_id as "departure_airport",
	d.long_decimal as "departure_longitude",
	d.lat_decimal as "departure_latitude",
	a.long_decimal as "arrival_longitude",
	a.lat_decimal as "arrival_latitude",
	a.resp_artcc_id as "arrival_artcc",
	a.arpt_id as "arrival_airport",
	u.red as "departure_red_units",
	u.blue as "departure_blue_units",
	u.green as "departure_green_units"
FROM
	flights f
	JOIN airports d ON ltrim(f.departure, 'K') = d.arpt_id
	JOIN airports a ON ltrim(f.arrival, 'K') = a.arpt_id
	JOIN units u ON u.artcc = d.resp_artcc_id
`
	);

	return json({ flights: response.rows, count: response.rowCount });
}
