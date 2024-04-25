import { drizzle } from 'drizzle-orm/postgres-js';
import type { EventHandlerRequest, H3Error, H3Event } from 'h3';
import type { FetchError } from 'ofetch';
import postgres from 'postgres';
import { z } from 'zod';

const idSchema = z.coerce.number().positive();

export function parseIdOrThrow(event: H3Event<EventHandlerRequest>) {
  const parse = idSchema.safeParse(event.context.params?.id);
  if (parse.success) return parse.data;
  else throw createError({ statusCode: 400, statusMessage: 'Bad Request' });
}

export function useTypedSession(event: H3Event<EventHandlerRequest>) {
  return useSession<{ id?: number; name?: string }>(event, {
    password: event.context.cloudflare.env.SESSION_KEY,
  });
}

export type ApiError<Data = undefined> = FetchError<
  Pick<
    H3Error<Data>,
    'statusCode' | 'statusMessage' | 'message' | 'stack' | 'data'
  >
>;

export function getDb({ context }: H3Event<EventHandlerRequest>) {
  return drizzle(postgres(context.cloudflare.env.DATABASE_URL));
}
