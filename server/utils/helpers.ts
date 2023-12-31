import type { EventHandlerRequest, H3Error, H3Event, SessionConfig } from 'h3';
import type { FetchError } from 'ofetch';
import { z } from 'zod';

const idSchema = z.coerce.number().positive();

export function parseIdOrThrow(event: H3Event<EventHandlerRequest>) {
  const parse = idSchema.safeParse(event.context.params?.id);
  if (parse.success) return parse.data;
  else throw createError({ statusCode: 400, statusMessage: 'Bad Request' });
}

const SESSIONCFG = { password: process.env.SESSION_KEY } as SessionConfig;

export function useTypedSession(event: H3Event<EventHandlerRequest>) {
  return useSession<{ id?: number; name?: string }>(event, SESSIONCFG);
}

export type ApiError<Data = undefined> = FetchError<
  Pick<
    H3Error<Data>,
    'statusCode' | 'statusMessage' | 'message' | 'stack' | 'data'
  >
>;
