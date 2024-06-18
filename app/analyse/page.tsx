import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  // console.log(user)
  if (!user) {
    return redirect('/login')
  }

  // const handleSubmit = async (formData: FormData) => {
  //   'use server'
  //   const title = formData.get('title')
  //   console.log(title)
  // }

  const renderQuestions = (category: any) => {
    return category.questions.map((question, index) => (
      <div key={index}>
        <p className="font-medium pt-4 pb-1">{question.question}</p>
        {/* Add input field based on question type (optional) */}
        <input
          type="text"
          className="px-3 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200"
        />
      </div>
    ))
  }

  const handleSubmit = async (formData: FormData) => {
    'use server'

    const user_id = user?.id ?? ''
    const doc_id = null // Assuming you have logic to generate doc_id(s)

    const qna = categories.map((category) => ({
      category: category.category,
      questions: category.questions.map((question, index) => ({
        question: question.question,
        answer: formData.get(`qna[${category.category}][${index}][answer]`),
      })),
    }))

    const data = {
      user_id,
      doc_id,
      qna,
    }
    console.log('Submitting data:', JSON.stringify(data))
    // const response = await fetch('/api/submit-data', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })

    // // Handle response (success/failure)
    // if (response.ok) {
    //   console.log('Data submitted successfully!')
    //   // Handle successful submission (e.g., redirect)
    // } else {
    //   console.error('Error submitting data:', await response.text())
    //   // Handle submission error (e.g., display error message)
    // }
  }

  return (
    <>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full">
          <div className="py-6 font-bold tracking-widest dark:bg-blue-950 bg-blue-100 text-center">
            ANALYSE YOUR HEALTH
          </div>
        </div>
        <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
          <p>
            userid - {user?.id ?? ''}, mail - {user?.email ?? ''}
          </p>

          <form action={handleSubmit}>
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
        </div>
      </div>
    </>
  )
}
