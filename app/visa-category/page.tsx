
import { IRItemRow } from '../components/ir/ir-category-section'
import { IRCategorySection } from '../components/ir/ir-item-row'

const VisaCategory = () => {
  return (
    <div>
      <IRItemRow
        title="Visa Category Title"
        description="Description of the visa category."
        videoLabel="Watch Video"
        roadmapLabel="View Roadmap"
      />
      <IRCategorySection />
    </div>
  )
}

export default VisaCategory