import type { ServerLoadEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

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

function calculateColor(units: any) {
	let baseColor = '#CCCCCC';
	if (units.red === units.green && units.green === units.blue) {
		return baseColor;
	}

	// calculate the winning hex color using the units
	let totalUnits = units.red + units.green + units.blue;
	let redPercentage = units.red / totalUnits;
	let greenPercentage = units.green / totalUnits;
	let bluePercentage = units.blue / totalUnits;

	return rgbToHex(
		Math.round(redPercentage * 255),
		Math.round(greenPercentage * 255),
		Math.round(bluePercentage * 255)
	);
}

function rgbToHex(r: number, g: number, b: number) {
	return (
		'#' +
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			})
			.join('')
	);
}
