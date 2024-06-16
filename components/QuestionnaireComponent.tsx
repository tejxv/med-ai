'use client'
import React from 'react'

interface QuestionnaireComponentProps {
  onSubmit: (responses: { question: string; answer: string }[]) => void
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

  const textFieldQuestions = new Set([
    'What brings you in today?',
    'Do you have any new symptoms or health concerns?',
    'Are you experiencing any pain or discomfort?',
  ])

  const formRef = React.useRef(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    const responses = questions.map((q, index) => ({
      question: q.question,
      answer: formData.get(`question-${index}`) as string,
    }))
    onSubmit(responses)
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col py-10 gap-8"
    >
      {questions.map((q, index) => (
        <div key={index} className="flex flex-col gap-2">
          <label className="text-md text-gray-600 pl-4 font-semibold">
            {q.question}
          </label>
          <div className="relative">
            {textFieldQuestions.has(q.question) ? (
              <input
                type="text"
                name={`question-${index}`}
                className="px-3 py-2.5 border bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:outline-gray-800 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
                required
              />
            ) : (
              <select
                name={`question-${index}`}
                className="px-3 py-2.5 cursor-pointer border bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:outline-gray-800 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl pr-10"
                defaultValue=""
                required
              >
                <option value="" className="appearance-none">
                  <span>Choose your answer</span>
                </option>
                {q.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            <div className="absolute inset-y-0 right-2 flex items-center px-2 pointer-events-none">
              {!textFieldQuestions.has(q.question) && (
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="mt-4 px-2 py-2.5 bg-blue-500 text-white rounded-xl shadow-md hover:opacity-75"
      >
        Submit
      </button>
    </form>
  )
}

export default QuestionnaireComponent
