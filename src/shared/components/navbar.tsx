import Link from 'next/link'
import { createClient } from '@/core/supabase/server'
import { Button } from '@/components/ui/button'
import { signOut } from '@/features/auth/actions'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b bg-white">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <span className="bg-zinc-900 text-white px-2 py-1 rounded-md">Feedback</span>Flow
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-zinc-600 hidden sm:block">
                                {user.email}
                            </span>
                            <form action={signOut}>
                                <Button variant="ghost" type="submit">Wyloguj</Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button>Zaloguj się</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
