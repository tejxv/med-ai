// app/report/[id]/page.js
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import Markdown from 'react-markdown'

// Fetch report data based on report ID and user ID
async function fetchReport(id, user_id) {
  const supabase = createClient()

  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user_id)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching report:', error)
    return null
  }

  return report
}

// The page component for displaying the report
export default async function ReportPage({ params }) {
  const { id } = params
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const report = await fetchReport(id, user.id)

  if (!report) {
    return <p>No report found</p>
  }

  return (
    <div className="animate-in max-w-4xl mx-auto py-6 px-3.5">
      <Link href="/">
        <p className="text-blue-600 hover:underline">← Back to reports</p>
      </Link>
      <h1 className="text-2xl font-bold my-4">Report #{report.id}</h1>
      <p>
        <strong>Date:</strong>{' '}
        {new Date(report.created_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: '2-digit',
        })}{' '}
        <p className="text-gray-500 inline">
          {' '}
          –{' '}
          {formatDistanceToNow(new Date(report.created_at), {
            addSuffix: false,
          })}
        </p>
      </p>
      <p className="mt-4 border-t border-gray-200 pt-4">
        <Markdown>{report.analysis}</Markdown>
      </p>
    </div>
  )
}
