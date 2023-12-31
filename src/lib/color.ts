export function calculateColor(units: { red: number; green: number; blue: number }) {
	if (units.red === units.green && units.green === units.blue) {
		return '#CCCCCC';
	}

	// Normalize the units by subtracting the smallest unit from all units
	const smallestUnit = Math.min(units.red, units.green, units.blue);
	const red = units.red - smallestUnit;
	const green = units.green - smallestUnit;
	const blue = units.blue - smallestUnit;

	// calculate the winning hex color using the units
	let totalUnits = red + green + blue;
	let redPercentage = red / totalUnits;
	let greenPercentage = green / totalUnits;
	let bluePercentage = blue / totalUnits;

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

export function calculateIconColor(units: { red: number; green: number; blue: number }) {
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
		return 'red-green';
	}

	if (red === blue && red > green) {
		return 'red-blue';
	}

	if (green === blue && green > red) {
		return 'green-blue';
	}

	if (red === green && red === blue && red > 0) {
		return 'red-green-blue';
	}

	return 'gray';
}
