import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <h1 className="text-4xl font-bold">Welcome to Hono!</h1>
      <p className="text-xl">Hello, world!</p>
      <Button>Button</Button>

      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  )
}
