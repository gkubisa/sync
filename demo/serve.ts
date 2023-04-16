import { Application, isHttpError, load, Router, Status } from './deps.ts'

await load({ export: true, restrictEnvAccessTo: ['DEMO_PORT'] })

const port = Number(Deno.env.get('DEMO_PORT'))
const basePath = Deno.env.get('DEMO_BASE_PATH')
const root = Deno.args[0]

const app = new Application()

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.info(
    `Client serving files from ${root} at ${secure ? 'https://' : 'http://'}${
      hostname ?? 'localhost'
    }:${port}${basePath}`,
  )
})

const router = new Router().get(`${basePath}:path*`, async (context) => {
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
