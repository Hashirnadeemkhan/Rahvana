
import { IRItemRow } from "./ir-category-section"

export function IRCategorySection() {
  return (
    <section id="ir-category" className="container mx-auto px-6 py-20">
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 tracking-wide">
          IMMEDIATE RELATIVE (IR) CATEGORY
        </h2>
      </div>

      {/* Description */}
      <div className="mx-auto mt-8 max-w-5xl rounded-xl border border-gray-200 bg-white text-gray-700 p-6 md:p-10 shadow-md">
        <p className="text-pretty leading-relaxed text-center">
          Learn about Immediate Relative (IR) visa categories. Understand eligibility, timelines, and how our
          assistant helps you step-by-step to complete your forms accurately with guidance and care.
        </p>
      </div>

      <div className="border-t border-blue-200 my-12" />

      {/* IR-1 */}
      <IRItemRow
        title="IR-1"
        description="This category applies to the spouse of a U.S. citizen. The process involves documentation, sponsorship, and consular interview steps. Our guide helps you every step of the way."
        videoLabel="Watch IR-1 Explainer Video"
        roadmapLabel="View IR-1 Roadmap"
      />

      <div className="border-t border-blue-200 my-12" />

      {/* IR-5 */}
      <IRItemRow
        title="IR-5"
        description="The IR-5 visa is for parents of U.S. citizens aged 21 or older. We simplify the complex process by explaining each form, eligibility requirement, and timeline clearly."
        videoLabel="Watch IR-5 Explainer Video"
        roadmapLabel="View IR-5 Roadmap"
      />

      <div id="consultancy" className="sr-only">Consultancy section anchor</div>
      <div id="contact" className="sr-only">Contact section anchor</div>
    </section>
  )
}