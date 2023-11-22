import type { Handle } from '@sveltejs/kit';

import { connect } from '$lib/db';

export const handle: Handle = async ({ event, resolve }) => {
	const db = await connect();

	try {
		await db.connect();
		event.locals.db = db;
		const response = await resolve(event);
		return response;
	} finally {
		await db.release();
	}
};
