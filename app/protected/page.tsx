import { createClient } from "@/utils/supabase/server"
import Header from "@/components/Header"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  // Fetching reports data
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching reports:", error)
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <div className="py-6 font-bold dark:bg-blue-950 bg-blue-100 text-center">
          Welcome to THRIVE
        </div>
      </div>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3"></div>
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <Link
            href="/analyse"
            className="p-4 w-full bg-blue-600 tracking-wide text-center rounded-2xl hover:bg-black text-white shadow-xl hover:shadow-2xl hover:ring-4 hover:ring-black ring-1 ring-blue-700 transition-all"
          >
            Take the <span className="font-bold">Health Questionnaire</span>
          </Link>
          <p className="text-base text-gray-500 text-center">
            Helps your doctor give you better care, faster.
          </p>

          {/* Display reports if they exist */}
          {reports && reports.length > 0 ? (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">
                🔄 Your Previous Reports
              </h2>
              <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports
                  .filter((report) => report.analysis)
                  .map((report) => (
                    <li
                      key={report.id}
                      className="p-4 rounded-lg bg-white border hover:-translate-y-1 active:bg-gray-100 border-gray-200 hover:border-gray-300 hover:drop-shadow-xl cursor-pointer transition-all"
                    >
                      <Link href={`/protected/${report.id}`}>
                        <p className="text-sm border-b pb-3 mb-3 opacity-50 border-gray-300 uppercase text-gray-700">
                          📁 – {report.department}
                        </p>
                        <p className="line-clamp-5 text-gray-800">
                          {report.analysis}
                        </p>
                        <div className="flex mt-6 pt-3 border-t opacity-50 justify-between border-gray-300">
                          <p className="text-sm text-gray-700">
                            Report ID – #{report.id}
                          </p>
                          <p className="text-sm text-gray-700">
                            {" "}
                            {new Date(report.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="mt-12 px-6 border border-gray-200 max-w-md rounded-3xl py-8 opacity-70 gap-2 flex flex-col items-center justify-center bg-slate-100">
              <h1 className="font-semibold">No Previous Reports Found.</h1>
              <p className="text-center text-balance">
                Your previous health reports will show up here. Take your first
                Health Questionnaire to get started.
              </p>
            </div>
          )}
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
