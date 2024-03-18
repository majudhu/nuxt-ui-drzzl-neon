import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pbkdf2 } from './crypto-pbkdf2';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export async function init() {
  const client = postgres(import.meta.env.DATABASE_URL!);
  try {
    const db = drizzle(client);
    const anyUsers = await db
      .select({})
      .from(users)
      .where(eq(users.name, 'admin2'))
      .limit(1);
    if (anyUsers.length === 0) {
      await db.insert(users).values({
        name: 'admin2',
        password: await pbkdf2('1234'),
      });
    }
  } finally {
    client.end();
  }
}
