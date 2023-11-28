// @ts-ignore
import pgpkg from 'pg';
const { Client } = pgpkg;

const client = new Client({ connectionString: process.env.DB_CONNECTION_STRING });
export const connect = async () => {
	await client.connect();
	return client;
};
