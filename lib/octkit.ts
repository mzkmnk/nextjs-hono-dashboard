import { Octokit } from '@octokit/rest'

export function octokit(token: string) {
  return new Octokit({
    auth: token,
  })
}
