'use client';

import { useState } from 'react';
import CombinedIntakeFormWrapper from './components/CombinedIntakeFormWrapper';
import ActionPlanResults from './components/ActionPlanResults';
import { classifySituation, ClassificationResult } from './utils/classifier';
import { generateActionPlan, ActionPlan } from './utils/actionPlanGenerator';
import { FormData, FormSelections } from './types/221g';

export default function TwentyTwoOneGActionPlanner() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedItems, setSelectedItems] = useState<FormSelections | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (data: FormData, selectedItems: FormSelections = {}) => {
    // Classify the situation based on form data
    const classificationResult = classifySituation(data);
    setClassification(classificationResult);

    // Convert selected items to array of keys for the action plan generator
    const selectedItemsArray = Object.keys(selectedItems).filter(key => selectedItems[key as keyof FormSelections]);

    // Generate the action plan based on classification and selected 221(g) items
    const plan = generateActionPlan(classificationResult, selectedItemsArray);
    setActionPlan(plan);
    setFormData(data);
    setSelectedItems(selectedItems);

    // Show the results
    setShowResults(true);
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {!showResults ? (
        <CombinedIntakeFormWrapper onSubmit={handleSubmit} />
      ) : (
        <ActionPlanResults
          classification={classification}
          actionPlan={actionPlan}
          formData={formData}
          selectedItems={selectedItems}
          onBackToForm={handleBackToForm}
        />
      )}
    </div>
  );
}