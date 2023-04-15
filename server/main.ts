import { Application, load, Router } from './deps.ts'

await load({ export: true, restrictEnvAccessTo: ['SERVER_PORT'] })

const port = Number(Deno.env.get('SERVER_PORT'))
const app = new Application()
const router = new Router()

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.info(
    `Server listening on: ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`,
  )
})

router.get('/api/v1/sync', (context) => {
  context.response.body = 'Hello'
})

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port })
