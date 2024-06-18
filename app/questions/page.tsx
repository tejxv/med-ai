'use client'
import QuestionnaireComponent from '@/components/QuestionnaireComponent'

export default function Questions() {
  const handleSubmit = (responses: { question: string; answer: string }[]) => {
    console.log(JSON.stringify(responses))
    alert('Success! Check console for JSON output.')
    // You can handle the JSON output here, e.g., sending it to an API
  }

  return (
    <>
      <div className="py-20 px-10 animate-in">
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">📋 Health Questionnaire</h2>
          <QuestionnaireComponent onSubmit={handleSubmit} />
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
    </>
  )
}
