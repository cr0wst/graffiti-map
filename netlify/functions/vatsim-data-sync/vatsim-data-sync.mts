import { Config } from '@netlify/functions';

export default async (req: Request) => {
	console.log('Sync');

	return {
		statusCode: 200
	};
};

export const config: Config = {
	schedule: '* * * * *'
};
