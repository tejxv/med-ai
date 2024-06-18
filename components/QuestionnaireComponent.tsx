'use client'
import React, { useState } from 'react'

interface QuestionnaireComponentProps {
  onSubmit: (responses: {
    user_id: string
    doc_id: string[]
    qna: {
      category: string
      questions: { question: string; answer: string }[]
    }[]
  }) => void
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({
  onSubmit,
}) => {
  const [userId, setUserId] = useState('')
  const [docId, setDocId] = useState('')
  const categories = [
    {
      category: 'General Questions',
      questions: [
        { question: 'What are your main symptoms?' },
        { question: 'How long have you been experiencing these symptoms?' },
        {
          question: 'Have you experienced these symptoms before? If yes, when?',
        },
        { question: 'On a scale of 1 to 10, how severe are your symptoms?' },
        {
          question:
            'Have you recently experienced any significant changes in your health or lifestyle?',
        },
      ],
    },
    {
      category: 'Specific Symptoms',
      questions: [
        {
          question:
            'Do you have a fever? If yes, what is your current temperature?',
        },
        {
          question:
            'Are you experiencing any pain? If so, where is the pain located and what does it feel like (sharp, dull, throbbing, etc.)?',
        },
        {
          question:
            'Do you have any difficulty breathing or shortness of breath?',
        },
        {
          question:
            'Have you noticed any swelling, redness, or other changes in the affected area?',
        },
        { question: 'Do you have any rashes or unusual skin changes?' },
      ],
    },
    {
      category: 'Medical History',
      questions: [
        { question: 'Do you have any pre-existing medical conditions?' },
        {
          question:
            'Are you currently taking any medications? If so, what are they?',
        },
        { question: 'Have you recently stopped taking any medications?' },
        { question: 'Do you have any known allergies?' },
        {
          question: 'Have you had any recent surgeries or medical procedures?',
        },
      ],
    },
    {
      category: 'Lifestyle and Environment',
      questions: [
        { question: 'Have you been under any unusual stress recently?' },
        { question: 'Have you been traveling recently? If so, where?' },
        { question: 'Have you been in contact with anyone who is sick?' },
        { question: 'Do you smoke, drink alcohol, or use recreational drugs?' },
        {
          question:
            'Have there been any changes to your diet or exercise routine?',
        },
      ],
    },
    {
      category: 'Family History',
      questions: [
        {
          question:
            'Do you have a family history of similar symptoms or conditions?',
        },
        { question: 'Are there any hereditary conditions in your family?' },
      ],
    },
    {
      category: 'Previous Treatments and Outcomes',
      questions: [
        {
          question:
            'Have you tried any over-the-counter medications or home remedies for your symptoms? If so, what were they and did they help?',
        },
        {
          question:
            'Have you visited a doctor or healthcare provider for these symptoms before? If yes, what was the diagnosis and treatment?',
        },
      ],
    },
    {
      category: 'Follow-up and Monitoring',
      questions: [
        {
          question:
            'Are your symptoms getting better, worse, or staying the same?',
        },
        { question: 'Have you noticed any new symptoms developing?' },
      ],
    },
  ]

  const formRef = React.useRef(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    const qna = categories.map((category) => ({
      category: category.category,
      questions: category.questions.map((q, index) => ({
        question: q.question,
        answer: formData.get(`${category.category}-${index}`) as string,
      })),
    }))
    onSubmit({ user_id: userId, doc_id: [docId], qna })
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col py-10 gap-8"
    >
      <div>Upload Report</div>
      <div className="flex flex-col gap-2">
        <label className="text-md text-gray-600 mt-4 pl-3.5 font-medium">
          User ID
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="px-3 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-md text-gray-600 mt-4 pl-3.5 font-medium">
          Document ID
        </label>
        <input
          type="text"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          className="px-3 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
          required
        />
      </div>
      {categories.map((category, catIndex) => (
        <div key={catIndex}>
          <h3 className="pb-4 pl-3.5 border-b border-gray-200 text-lg font-semibold">
            {category.category}
          </h3>
          {category.questions.map((q, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label className="text-md text-gray-600 mt-4 pl-3.5 font-medium">
                {q.question}
              </label>
              <textarea
                name={`${category.category}-${index}`}
                className="px-3 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl resize-none overflow-hidden"
                required
                autoComplete="off"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${target.scrollHeight + 2}px`
                }}
              />
            </div>
          ))}
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
