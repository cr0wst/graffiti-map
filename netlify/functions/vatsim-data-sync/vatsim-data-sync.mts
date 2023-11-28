import { Config } from '@netlify/functions';

export default async (req: Request): Promise<Response> => {
	console.log('Sync');

	return new Response('OK');
};

export const config: Config = {
	schedule: '* * * * *'
};
