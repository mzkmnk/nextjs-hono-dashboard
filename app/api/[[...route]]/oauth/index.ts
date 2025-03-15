import {
  createRefreshToken,
  setCookies,
} from '@/app/api/[[...route]]/helper/utils'
import { githubAuth } from '@hono/oauth-providers/github'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const oauthRoute = new Hono()
  .use(
    '/github',
    githubAuth({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      scope: ['public_repo', 'user:email', 'user', 'user:follow'],
      oauthApp: true,
    }),
  )
  .get('/github', async (c) => {
    const token = c.get('token')

    const user = c.get('user-github')

    console.log('user', user)

    if (!token?.token || !user || !user.id) {
      throw new HTTPException(404, { message: 'User not found' })
    }

    const refreshToken = await createRefreshToken('')

    setCookies(() => {
      return {
        token: token.token,
        refreshToken,
      }
    }, c)

    return c.redirect('/internal/dashboard')
  })
  .onError((error, c) => {
    if (error instanceof HTTPException) {
      c.json(
        {
          message: error.message,
        },
        error.status,
      )
      return c.redirect('/')
    }

    return c.json(
      {
        message: 'Internal server error',
      },
      500,
    )
  })
