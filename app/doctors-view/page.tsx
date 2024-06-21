import Markdown from 'react-markdown'
import { createClient } from '@/utils/supabase/server'

export default async function DoctorsView() {
  const supabase = createClient()

  // Fetch all reports
  const { data: reports, error } = await supabase.from('reports').select('*')

  if (error) {
    console.error('Error fetching reports:', error)
    return <p>No reports for you</p>
  }

  return (
    <div className="animate-in max-w-4xl mx-auto py-6 px-3.5">
      <h1 className="text-2xl font-bold my-4">Doctor's Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-4 rounded-lg bg-white border border-gray-200 transition-all"
          >
            <h2 className="text-lg font-semibold">Report #{report.id}</h2>
            <p className="text-sm text-gray-500">
              Date:{' '}
              {new Date(report.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <Markdown className="mt-2">{report.analysis}</Markdown>
          </div>
        ))}
      </div>
    </div>
  )
}
