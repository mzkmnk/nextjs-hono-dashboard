'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { client } from '@/lib/hono'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState<string>('')

  const [password, setPassword] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const signIn = async () => {
    setLoading(true)

    const req = await client.api.auth.signIn.$post({
      json: { email, password },
    })

    if (req.status === 200) {
      router.push('/internal/dashboard')
      return
    }

    setLoading(false)
  }

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

      <Input
        placeholder="Email"
        className="w-1/4"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        className="w-1/4"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={signIn} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </div>
  )
}
