import { Config } from '@netlify/functions';
import { connect } from '../lib/db';

/**
 * This function is run every day to increase the color units for the starting vARTCCs by 5. This is done
 * to ensure that the amount of available color units is always increasing.
 *
 * Note: This doesn't actually remove any of the other color units, it only increases the amount.
 *
 * @param req
 */
export default async (req: Request) => {
	const query = `
	UPDATE units
SET 
  green = green + CASE WHEN artcc IN ('KZLA', 'KZOA', 'KZSE') THEN 5 ELSE 0 END,
  red = red + CASE WHEN artcc IN ('KZME', 'KZFW', 'KZHU') THEN 5 ELSE 0 END,
  blue = blue + CASE WHEN artcc IN ('KZBW', 'KZNY', 'KZDC') THEN 5 ELSE 0 END;
`;
	const db = await connect();
	const result = await db.query(query);

	await db.end();
};

export const config: Config = {
	schedule: '@daily'
};
