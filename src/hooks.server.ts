import type { Handle } from '@sveltejs/kit';

import { connect } from '$lib/db';

export const handle: Handle = async ({ event, resolve }) => {
	const db = await connect();

	event.locals = { db };

	const response = await resolve(event);

	db.release();

	return response;
};
