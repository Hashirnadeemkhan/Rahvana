"use client"

interface Field {
  key: string
  label: string
}

interface ReviewPageProps {
  formData: Record<string, string>
  sections: { title: string; fields: Field[] }[]
  onEditStep: (step: number) => void
  onBackToForm: () => void
  onPreviewPDF: () => void
  onDownloadPDF: () => void
}

export function ReviewPage({
  formData,
  sections,
  onEditStep,
  onBackToForm,
  onPreviewPDF,
  onDownloadPDF,
}: ReviewPageProps) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Information</h2>
        <p className="text-gray-600">
          Please review all sections. Click &#34;Edit&#34; to make changes.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section, idx) => {
          const stepNum = idx + 1
          const hasData = section.fields.some((f) => formData[f.key])

          return (
            <div
              key={`${section.title}-${idx}`}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div
                className="bg-blue-50 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition"
                onClick={() => onEditStep(stepNum)}
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Step {stepNum}: {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {hasData ? "Completed" : "No information provided"}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditStep(stepNum)
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Edit
                </button>
              </div>

              <div className="px-6 py-4 space-y-3 bg-white">
                {section.fields.map((field) => (
                  <div
                    key={field.key}
                    className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-semibold text-gray-700 flex-1">{field.label}:</span>
                    <span className="text-gray-600 text-right max-w-xs ml-4">
                      {formData[field.key] || <span className="text-gray-400 italic">Empty</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8 justify-between">
        <button
          onClick={onBackToForm}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
        >
          Back to Form
        </button>

        <button
          onClick={onPreviewPDF}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          Preview PDF
        </button>

        <button
          onClick={onDownloadPDF}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  )
}