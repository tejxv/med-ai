import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import Link from 'next/link'

export default async function Index() {
  const supabase = createClient()

  // Check if the user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/protected')
    return null
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4 animate-pulse">_</h2>
          <p>
            <a
              href="/login"
              className="font-semibold hover:underline"
              rel="noreferrer"
            >
              Create an account
            </a>{' '}
            on Med-AI to get started
          </p>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Precision Care Challenge · Developed by{' '}
          <a
            href="#"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            The Team
          </a>
        </p>
      </footer>
    </div>
  )
}
