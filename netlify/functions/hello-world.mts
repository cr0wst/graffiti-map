import { Config } from '@netlify/functions';

export default async (req: Request) => {
	// Send 2 console commands to simulate sending one every 30 seconds. Netlify functions can only be triggered
	// once a minute. But we might want to do more than that.
	await run();
	await sleep(30000);
	await run();
};

async function run() {
	console.log('Hello, world!');
}

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const config: Config = {
	schedule: '* * * * *'
};
