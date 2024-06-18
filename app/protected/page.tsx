import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <div className="py-6 font-bold dark:bg-blue-950 bg-blue-100 text-center">
          Welcome to Med-AI
        </div>
      </div>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3"></div>
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <Link
            href="/questions"
            className="p-4 rounded-2xl ring-1 hover:ring-2 transition-all"
          >
            Take the{' '}
            <span className="font-bold mb-4">Health Questionnaire</span>
          </Link>
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
