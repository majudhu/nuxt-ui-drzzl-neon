# Nuxt 3 • Nuxt UI • Drizzle ORM • Neon • Zod

[A basic crud app demo](https://nuxt-ui-drzzl-neon.vercel.app) made to learn and experiment [Vue](https://vuejs.org/), [Nuxt](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com), [Drizzle](https://orm.drizzle.team), [Neon](https://neon.tech) and [Zod](https://zod.dev)

[Also available on Cloudflare Pages](https://nuxt-ui-drzzl-neon.pages.dev)  
[Checkout branch cf](https://github.com/majudhu/nuxt-ui-drzzl-neon/tree/cf)

## Features

- Backend Zod validation input type shared with frontend form data type
- useFetch return data is reused as form state
- Zod parse function used with h3 readValidatedBody
- h3 cookie session and nitro middleware used to load session and guard routes
- use data loaded from index route to eagerly preload data into single item route
- post route zod schema and type reused in put route as partial
- database seeding during server init
