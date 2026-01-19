'use client';

import dynamic from 'next/dynamic';

// Dynamically import the CombinedIntakeForm to avoid hydration issues
const DynamicCombinedIntakeForm = dynamic(
  () => import('./CombinedIntakeForm'),
  { 
    ssr: false, // Disable server-side rendering for this component
    loading: () => <div>Loading form...</div> // Optional loading component
  }
);

interface CombinedIntakeFormWrapperProps {
  onSubmit: (data: import('../types/221g').FormData, selected221gItems: import('../types/221g').FormSelections) => void;
}

export default function CombinedIntakeFormWrapper({ onSubmit }: CombinedIntakeFormWrapperProps) {
  return <DynamicCombinedIntakeForm onSubmit={onSubmit} />;
}