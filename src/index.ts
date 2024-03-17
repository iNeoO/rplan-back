import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { logger } from 'hono/logger'

import authRoutes from './routes/auth.route';

const app = new OpenAPIHono()

app.use(logger())


app.openapi(
  createRoute({
    method: 'get',
    path: '/hello',
    responses: {
      200: {
        description: 'Respond a message',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string()
            })
          }
        }
      }
    }
  }),
  (c) => {
    return c.json({
      message: 'hello'
    })
  }
)

app.route('auth', authRoutes)

app.get(
  '/ui',
  swaggerUI({
    url: '/doc'
  })
)

app.get(
  '/ui/json',
  swaggerUI({
    url: '/doc'
  })
)

app.doc('/doc', {
  info: {
    title: 'An API',
    version: 'v1'
  },
  openapi: '3.1.0'
})

export default app