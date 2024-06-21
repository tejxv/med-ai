"use client"
import Link from "next/link"
import { useState } from "react"
import Markdown from "react-markdown"
import { createClient } from "@/utils/supabase/client"

const categories = [
  {
    category: "General",
    questions: [
      {
        question: "Purpose of Visit",
      },
      {
        question: "What is your age and Sex?",
      },
      {
        question:
          "What are your main symptoms and for how long have you been experiencing them?",
      },
      {
        question:
          "Are you currently taking any medications? If so, what are they?",
      },
      {
        question: "Are there any hereditary conditions in your family?",
      },
      {
        question: "Do you have any known allergies?",
      },
    ],
  },
]
const departments = [
  "General Medicine",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Dermatology",
  "Cardiology",
  "Neurology",
  "Gastroenterology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
]
export default function MedForm({ userId }: { userId: string }, docId: any) {
  const supabase = createClient()
  const [status, setStatus] = useState("idle")
  const [analysis, setAnalysis] = useState(null)
  const [department, setDepartment] = useState(departments[0])
  const [followUpQuestions, setFollowUpQuestions] = useState([])
  const [initialQna, setInitialQna] = useState({})
  const [doctorMapping, setDoctorMapping] = useState(null)

  const saveToSupabase = async ({
    user_id,
    doc_id,
    qna,
    analysis,
    department,
    visit_id,
  }) => {
    const { data, error } = await supabase.from("reports").insert([
      {
        user_id,
        reports: doc_id,
        responses: qna,
        analysis,
        department,
        visit_id,
      },
    ])
    if (error) {
      console.log(error)
    }
  }

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
          className="px-3 mt-2 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
        />
      </div>
    ))
  }

  const renderFollowUpQuestions = () => {
    return followUpQuestions.slice(0, 5).map((question: any, index: any) => (
      <div key={index} className="py-2">
        <label htmlFor={`followup[${index}]`} className="font-medium pt-4 pb-1">
          {question}
        </label>
        <input
          type="text"
          name={`followup[${index}]`}
          id={`followup[${index}]`}
          className="px-3 mt-2 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 appearance-none transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
        />
      </div>
    ))
  }

  const uploadReports = async (file) => {
    try {
      const formData = new FormData()
      formData.append("user_id", userId)
      formData.append("files", file)

      const res = await fetch(
        `https://hackathonaibackend.azurewebsites.net/upload_docs`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await res.json()

      const { path_stored } = data
      return path_stored
    } catch (e) {
      console.log(e)
      return ""
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      setStatus("loading")

      const qna = {}
      categories.forEach((category) => {
        category.questions.forEach((question, index) => {
          const answer =
            formData.get(`qna[${category.category}][${index}][answer]`) || ""
          qna[question.question] = answer // Use question text as key and answer as value
        })
      })

      let docId = ""

      if (formData.get("reports")) {
        const file = formData.get("reports")

        docId = await uploadReports(file)
      }

      if (followUpQuestions.length === 0) {
        const res = await fetch(
          "https://hackathonaibackend.azurewebsites.net/get_followup_questions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              qna: qna,
            }),
          }
        )
        const json = await res.json()
        if (json.success) {
          setInitialQna(qna)
          setFollowUpQuestions(json.followup_questions)
          setStatus("idle")
        } else {
          setStatus("error")
        }
      } else {
        const followUpQna = {}
        followUpQuestions.forEach((question, index) => {
          const answer = formData.get(`followup[${index}]`) || ""
          followUpQna[question] = answer
        })

        const combinedQna = { ...initialQna, ...followUpQna }

        const res = await fetch(
          "https://hackathonaibackend.azurewebsites.net/get_summary",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              qna: combinedQna,
              doc_id: docId,
              department: department,
            }),
          }
        )
        const json = await res.json()
        if (json.success) {
          const visitId = json.visit_id
          await saveToSupabase({
            user_id: userId,
            doc_id: [
              {
                doc_id: docId,
                doc_name: formData.get("reports")?.name || "",
              },
            ],
            qna: combinedQna,
            analysis: json.analysis,
            department,
            visit_id: visitId,
          })
          handleFetchDoctorMapping(visitId)
          setStatus("success")
          setAnalysis(json.analysis)
        } else {
          setStatus("error")
        }
      }
    } catch (e) {
      console.log(e)
      setStatus("error")
    }
  }
  const handleFetchDoctorMapping = async (visitId) => {
    try {
      const response = await fetch(
        "https://hackathonaibackend.azurewebsites.net/map_doctor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visit_id: visitId,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch doctor mapping")
      }

      const data = await response.json()
      if (data.success) {
        setDoctorMapping(data)
        console.log("Doctor Mapping:", data)
      } else {
        console.error("Error fetching doctor mapping:", data)
      }
    } catch (error) {
      console.error("Error fetching doctor mapping:", error)
    }
  }

  return (
    <div className="pb-4">
      {status == "success" ? (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <p className="font-base mb-6">Report has been generated!</p>
          <Markdown>{analysis}</Markdown>
          <button
            onClick={handleFetchDoctorMapping}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Book Appointment
          </button>
          {doctorMapping && (
            <div className="mt-4 bg-white p-4 rounded border border-gray-200">
              <h4 className=" text-sm mb-2">
                A doctor has been successfully appointed to you –
              </h4>
              <p className="font-bold text-2xl mb-2">
                Name: Dr. {doctorMapping.doctor_mapped.Doctor_name}
              </p>
              <p>📧 Email: {doctorMapping.doctor_mapped.Doctor_email}</p>
              <p>
                🗓️ Appointment Day:{" "}
                {doctorMapping.doctor_mapped["Day of Appointment"]}
              </p>{" "}
              <p>
                ⏰ Duration:{" "}
                {doctorMapping.doctor_mapped["Appointment Duration"]} minutes
              </p>{" "}
              <p>📂 Department: {doctorMapping.patient_department}</p>
            </div>
          )}
        </div>
      ) : status == "error" ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            There was an error submitting your form.
          </span>
        </div>
      ) : status == "loading" ? (
        <div className="animate-pulse font-bold text-2xl">
          <span className="mx-2">🔍</span>Analysing your responses...
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            handleSubmit(formData)
          }}
        >
          {followUpQuestions.length === 0 && (
            <>
              {" "}
              <div className="rounded-xl mb-8 border border-gray-200 bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    {/* Heroicon name: solid/check-circle */}
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Write with tranparancy and honesty
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your honesty will enable us to provide a more accurate
                        report for the doctor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <label
                  htmlFor="department"
                  className="font-medium pt-4 pb-1 mr-8"
                >
                  Choose the Department
                </label>
                <select
                  name="department"
                  id="department"
                  className="px-3 w-min py-2.5 border h-auto bg-transparent bg-white opacity-80 border-gray-200 hover:border-gray-300 dark:text-gray-300 outline-none dark:hover:border-gray-700 transition-all shadow-sm dark:border-gray-800 dark:bg-gray-900 rounded-xl"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {followUpQuestions.length === 0 &&
            categories.map((category) => (
              <div key={category.category}>
                <h3 className="text-xl font-semibold pb-4 my-4 border-gray-300 border-b">
                  {category.category}
                </h3>
                {renderQuestions(category)}
              </div>
            ))}

          {/* follow-up questions */}
          {followUpQuestions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold pb-4 my-4 border-gray-300 border-b">
                It sounds like you've been going through a lot. {""}To ensure I
                have all the information I need to best assist you, I have a
                couple more questions.
              </h3>
              {renderFollowUpQuestions()}
            </div>
          )}

          {/* reports upload */}

          {followUpQuestions.length === 0 && (
            <div className="py-2">
              <label htmlFor={`reports`} className="font-medium pt-4 pb-1">
                Upload Reports
              </label>
              <input
                type="file"
                name={`reports`}
                id={`reports`}
                className="px-3 py-2.5 border h-auto bg-transparent bg-white w-full opacity-80 border-gray-200"
              />
            </div>
          )}

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
