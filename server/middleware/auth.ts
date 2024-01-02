import { createError, defineEventHandler, sendRedirect } from 'h3';

export default defineEventHandler(async function (event) {
  if (
    event.path.startsWith('/admin') ||
    event.path.startsWith('/api/users') ||
    (event.path.startsWith('/api') &&
      event.method !== 'GET' &&
      !(event.path === '/api/auth' && event.method === 'POST'))
  ) {
    const session = await useTypedSession(event);
    if (session.data?.id) {
      if (event.path === '/admin/login') await sendRedirect(event, '/admin');
    } else {
      if (event.path.startsWith('/api'))
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
      else if (event.path !== '/admin/login')
        await sendRedirect(event, '/admin/login');
    }
  }
});
