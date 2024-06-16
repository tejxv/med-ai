'use client'
import QuestionnaireComponent from '@/components/QuestionnaireComponent'

export default function Questions() {
  const handleSubmit = (answers: string[]) => {
    console.log(JSON.stringify(answers))
    // You can handle the JSON output here, e.g., sending it to an API
  }

  return (
    <div className="py-20">
      <main className="flex-1 flex flex-col gap-6">
        <h2 className="font-bold text-4xl mb-4">Health Questionnaire</h2>
        <QuestionnaireComponent onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
