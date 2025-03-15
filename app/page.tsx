'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <h1 className="text-4xl font-bold">Welcome to Dashboard!</h1>
      <p>
        This dashboard was built using Hono.js, Next.js, Drizzle ORM, and
        Supabase.
      </p>
      <div className="flex -space-x-4">
        <Avatar className="border-white border-2 w-12 h-12">
          <AvatarImage src="avatars/avatar1.png" alt="avatar" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <Avatar className="border-white border-2 w-12 h-12">
          <AvatarImage src="avatars/avatar2.png" alt="avatar" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
      </div>

      <div className="w-1/4 flex gap-3 flex-col">
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => {
            window.location.href = '/api/oauth/github'
          }}
        >
          <img
            src="icons/github-mark.svg"
            alt="github"
            className="w-6 h-6 mr-2"
          />
          Github
        </Button>
      </div>
    </div>
  )
}
