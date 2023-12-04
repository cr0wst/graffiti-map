import { Config } from '@netlify/functions';
import { db } from './db';
import log from './log';
import { fetchData } from './vatsim';

/**
 * This function runs every minute to sync the VATSIM data from the Data API to the database.
 *
 * Unfortunately, the data updates every 15 seconds, but Netlify Functions only allow for a minimum of 1 minute.
 *
 * @param req
 */
export default async (req: Request) => {
	await run();

	return new Response('OK');
};

export const config: Config = {
	schedule: '* * * * *'
};

async function run() {
	log.info('Fetching Pilot Data');
	const data = await fetchData();

	await db('flights').del();
	await db('flights').insert(
		data.pilots
			.filter((pilot) => pilot.flight_plan?.departure && pilot.flight_plan?.arrival)
			.map((pilot) => ({
				callsign: pilot.callsign,
				cid: pilot.cid,
				name: pilot.name,
				latitude: pilot.latitude,
				longitude: pilot.longitude,
				altitude: pilot.altitude,
				groundspeed: pilot.groundspeed,
				departure: pilot.flight_plan.departure,
				arrival: pilot.flight_plan.arrival,
				heading: pilot.heading
			}))
	);

	log.info('Fetching Calculated Arrivals');
	const arrivals = await db('flight_status').select('*').where('aircraft_status', 'Arrived');

	if (arrivals.length == 0) {
		log.info('No arrivals found');
	} else {
		log.info('Fetching ARTCC Units from DB');
		const units = await db('units').select('*');

		for (const arrival of arrivals) {
			const source = units.find((unit) => unit.artcc === arrival.departure_artcc);
			const destination = units.find((unit) => unit.artcc === arrival.arrival_artcc);

			if (source && destination) {
				const color = calculateColor(source);
				if (color !== 'gray' && source[color] > 0) {
					log.info(`Moving units from ${source.artcc} to ${destination.artcc}`);
					destination[color]++;
					source[color]--;
				} else {
					log.info(`No units to move from ${source.artcc} to ${destination.artcc}`);
				}

				// Insert the processed arival into the flight archive table
				log.info('Inserting processed arrivals into flight archive');
				await db('flights_archive').insert({
					callsign: arrival.callsign,
					cid: arrival.cid,
					name: arrival.name,
					departure: arrival.departure,
					arrival: arrival.arrival,
					status: 'Processed',
					departure_color: color
				});
			} else {
				log.info(
					`Can't resolve source and destination for ${arrival.departure_artcc} to ${arrival.arrival_artcc}`
				);
			}
		}

		// Commit the changes to the database
		log.info('Committing changes to DB');
		units.forEach(async (unit) => {
			await db('units').update(unit).where('artcc', unit.artcc);
		});
	}

	await db.destroy();
}

function calculateColor(units: any) {
	const red = units.red;
	const green = units.green;
	const blue = units.blue;

	// return the color with the most units. If there is a tie between two colors for the lead, randomly pick one.
	// If all colors are tied at 0, return gray, which means no units are available.
	// If all colors are tied above 0 return a random color.
	if (red > green && red > blue) {
		return 'red';
	}

	if (green > red && green > blue) {
		return 'green';
	}

	if (blue > red && blue > green) {
		return 'blue';
	}

	if (red === green && red > blue) {
		return ['red', 'green'][Math.floor(Math.random() * 2)];
	}

	if (red === blue && red > green) {
		return ['red', 'blue'][Math.floor(Math.random() * 2)];
	}

	if (green === blue && green > red) {
		return ['green', 'blue'][Math.floor(Math.random() * 2)];
	}

	if (red === green && red === blue && red > 0) {
		return ['red', 'green', 'blue'][Math.floor(Math.random() * 3)];
	}

	if (red === blue && red === green && red > 0) {
		return ['red', 'green', 'blue'][Math.floor(Math.random() * 3)];
	}

	return 'gray';
}
