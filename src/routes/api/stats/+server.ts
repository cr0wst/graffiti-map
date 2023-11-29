import type { ServerLoadEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { calculateColor } from '$lib/color';

export async function GET({ params, locals }: ServerLoadEvent) {
	const { db } = locals;
	const response = await db.query('SELECT * FROM units');
	// Convert array of results into a map
	const units = response.rows.reduce((map, obj) => {
		obj.color = calculateColor(obj);
		map[obj.artcc] = obj;
		return map;
	}, {});
	return json(units);
}
