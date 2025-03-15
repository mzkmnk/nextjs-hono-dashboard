import { db } from '@/db'
import { InsUser, SelUser, users } from '@/db/schema'
import { GitHubUser } from '@hono/oauth-providers/github'
import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { v4 as uuidV4 } from 'uuid'

export const findUserByEmail = async ({
  email,
}: Pick<InsUser, 'email'>): Promise<SelUser | undefined> => {
  const user = await db.select().from(users).where(eq(users.email, email))
  return user[0]
}

export const createUser = async ({
  email,
  provider,
}: Pick<InsUser, 'email' | 'provider'>) => {
  const id = uuidV4()
  await db.insert(users).values({
    id,
    email,
    provider,
  })

  return id
}

export const createOrFindUser = async (
  githubUser: Partial<GitHubUser>,
): Promise<string> => {
  if (!githubUser.email) {
    throw new HTTPException(404, { message: 'Email not found' })
  }
  const user = await findUserByEmail({ email: githubUser.email })

  if (user) {
    return user.id
  }

  return await createUser({
    email: githubUser.email,
    provider: 'github',
  })
}
