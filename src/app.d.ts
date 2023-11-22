// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Client } from 'pg';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Client;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
