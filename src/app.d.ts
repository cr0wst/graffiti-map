// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { PoolClient } from 'pg';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: PoolClient;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
