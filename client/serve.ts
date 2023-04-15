import { Application, isHttpError, load, Router, Status } from './deps.ts'

await load({ export: true, restrictEnvAccessTo: ['CLIENT_PORT'] })

const port = Number(Deno.env.get('CLIENT_PORT'))
const root = Deno.args[0]

const app = new Application()

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.info(
    `Client serving files from ${root} at ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}/app`,
  )
})

const router = new Router().get('/app/:path*', async (context) => {
  const { path } = context.params
  try {
    await context.send({ root, path })
  } catch (error) {
    if (isHttpError(error) && error.status === Status.NotFound && !path?.includes('.')) {
      await context.send({ root, path: 'index.html' })
    } else {
      throw error
    }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port })
