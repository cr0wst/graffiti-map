import pgpkg from 'pg';
const { Pool } = pgpkg;

import { env } from '$env/dynamic/private';

const pool = new Pool({ connectionString: env.DB_CONNECTION_STRING });
export const connect = async () => await pool.connect();
