import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Header from "@/components/Header"
import Link from "next/link"

export default async function Index() {
  const supabase = createClient()

  // Check if the user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/protected")
    return null
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in justify-center content-center item-center flex-1 flex flex-col gap-20 opacity-0 w-full">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center gap-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Get started with THRIVE
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      AI platform to enhance doctors' efficiency and improve
                      patient care.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex-shrink-0 sm:flex sm:items-center">
                <a
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Create an account
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full border-t bg-white border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Precision Care Challenge · Developed by{" "}
          <a
            href="#"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Code for Cure
          </a>
        </p>
      </footer>
    </div>
  )
}
