'use client'
import Link from 'next/link'
import { useState } from 'react'
import Markdown from 'react-markdown'

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

export default function MedForm({ userId }: { userId: string }, docId: any) {
  const [status, setStatus] = useState('idle')
  const [analysis, setAnalysis] = useState(null)

  const renderQuestions = (category: any) => {
    return category.questions.map((question: any, index: any) => (
      <div key={index} className="py-2">
        <label
          htmlFor={`qna[${category.category}][${index}][answer]`}
          className="font-medium pt-4 pb-1"
        >
          {question.question}
        </label>
        <input
          type="text"
          name={`qna[${category.category}][${index}][answer]`}
          id={`qna[${category.category}][${index}][answer]`}
          className="px-3 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200"
        />
      </div>
    ))
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      setStatus('loading')
      const qna = categories.map((category) => ({
        category: category.category,
        questions: category.questions.map((question, index) => ({
          question: question.question,
          answer:
            formData.get(`qna[${category.category}][${index}][answer]`) || '', // Replace null/undefined with an empty string or a default value
        })),
      }))

      const res = await fetch(
        'https://hackathonaibackend.azurewebsites.net/get_summary',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            // doc_id: ["__report-test.jpg"],
            doc_id: [],
            qna: qna,
          }),
        }
      )
      const json = await res.json()
      if (json.success) {
        setStatus('success')
        setAnalysis(json.analysis)
      } else {
        setStatus('error')
      }
    } catch (e) {
      console.log(e)
      setStatus('error')
    }
  }

  return (
    <div className="pb-4">
      {status == 'success' ? (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <Markdown>{analysis}</Markdown>
        </div>
      ) : status == 'error' ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {' '}
            There was an error submitting your form.
          </span>
        </div>
      ) : status == 'loading' ? (
        <div>Loading...</div>
      ) : (
        <form
          action={(formData) => {
            handleSubmit(formData)
          }}
        >
          {categories.map((category) => (
            <div key={category.category}>
              <h3 className="text-xl font-semibold my-8 border-b">
                {category.category}
              </h3>
              {renderQuestions(category)}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 my-10 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  )
}
