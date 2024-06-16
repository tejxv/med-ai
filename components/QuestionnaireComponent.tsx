'use client'
import React from 'react'

interface QuestionnaireComponentProps {
  onSubmit: (answers: string[]) => void
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({
  onSubmit,
}) => {
  const questions = [
    {
      question: 'What brings you in today?',
      options: ['Routine check-up', 'New symptoms', 'Follow-up visit', 'Other'],
    },
    {
      question: 'Do you have any new symptoms or health concerns?',
      options: ['Yes', 'No', 'Unsure', 'Prefer not to say'],
    },
    {
      question: 'How would you rate your overall health?',
      options: ['Excellent', 'Good', 'Fair', 'Poor'],
    },
    {
      question: 'Are you experiencing any pain or discomfort?',
      options: ['Yes, mild', 'Yes, moderate', 'Yes, severe', 'No'],
    },
    {
      question: 'Have you had any changes in your weight recently?',
      options: [
        'Yes, gained weight',
        'Yes, lost weight',
        'No change',
        'Unsure',
      ],
    },
    {
      question: 'Are you taking any medications or supplements?',
      options: [
        'Yes, prescription medications',
        'Yes, over-the-counter medications',
        'Yes, supplements',
        'No',
      ],
    },
    {
      question: 'Do you have any allergies?',
      options: [
        'Yes, food allergies',
        'Yes, medication allergies',
        'Yes, environmental allergies',
        'No',
      ],
    },
    {
      question: 'How is your diet and exercise routine?',
      options: [
        'Balanced diet and regular exercise',
        'Balanced diet but no exercise',
        'Poor diet but regular exercise',
        'Poor diet and no exercise',
      ],
    },
    {
      question: 'Do you smoke, drink alcohol, or use any recreational drugs?',
      options: [
        'Yes, smoke',
        'Yes, drink alcohol',
        'Yes, use recreational drugs',
        'No',
      ],
    },
    {
      question:
        'Is there a family history of any significant illnesses or conditions?',
      options: [
        'Yes, heart disease',
        'Yes, diabetes',
        'Yes, cancer',
        'No significant family history',
      ],
    },
  ]

  const formRef = React.useRef(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    const answers = questions.map(
      (q, index) => formData.get(`question-${index}`) as string
    )
    onSubmit(answers)
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col py-10 gap-6"
    >
      {questions.map((q, index) => (
        <div key={index} className="flex flex-col gap-2">
          <label className="font-semibold">{q.question}</label>
          <select
            name={`question-${index}`}
            className="p-2 border border-gray-300 dark:text-gray-300 dark:border-gray-800 dark:bg-gray-900 rounded-md"
            defaultValue=""
          >
            <option value="" className="">
              Select an option
            </option>
            {q.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:opacity-75"
      >
        Submit
      </button>
    </form>
  )
}

export default QuestionnaireComponent
