import type { Handle } from '@sveltejs/kit';
import { DB_CONNECTION_STRING } from '$env/static/private';
import { Client } from 'pg';
export const handle: Handle = async ({ event, resolve }) => {
	const db = new Client({
		connectionString: DB_CONNECTION_STRING
	});

	try {
		await db.connect();
		event.locals.db = db;
		const response = await resolve(event);
		return response;
	} finally {
		await db.end();
	}
};
