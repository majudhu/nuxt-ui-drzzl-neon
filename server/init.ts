import { hash } from '@node-rs/argon2';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './schema';

export async function init() {
  const client = postgres(process.env.DATABASE_URL!);
  try {
    const db = drizzle(client);
    const anyUsers = await db.select({}).from(users).limit(1);
    if (anyUsers.length === 0) {
      await db.insert(users).values({
        name: 'admin',
        password: await hash('1234'),
      });
    }
  } finally {
    client.end();
  }
}
