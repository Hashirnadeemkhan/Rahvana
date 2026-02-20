"use client";

import { useState } from "react";
import CombinedIntakeFormWrapper from "./components/CombinedIntakeFormWrapper";
import ActionPlanResults from "./components/ActionPlanResults";
import { classifySituation, ClassificationResult } from "./utils/classifier";
import { generateActionPlan, ActionPlan } from "./utils/actionPlanGenerator";
import { FormData, FormSelections } from "./types/221g";
import { useAuth } from "@/app/context/AuthContext";
import { createBrowserClient } from "@supabase/ssr";
import { MasterProfile } from "@/types/profile";
import { useEffect } from "react";

export default function TwentyTwoOneGActionPlanner() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedItems, setSelectedItems] = useState<FormSelections | null>(
    null,
  );
  const [classification, setClassification] =
    useState<ClassificationResult | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const [initialSelections, setInitialSelections] =
    useState<FormSelections | null>(null);

  const { user } = useAuth(); // Assuming useAuth hook is available globally or imported
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Restore session from profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from("user_profiles")
          .select("profile_details")
          .eq("id", user.id)
          .single();

        if (data?.profile_details) {
          const profile = data.profile_details as MasterProfile;
          if (profile.actionPlanner?.questionnaire) {
            // Restore
            const savedData = profile.actionPlanner.questionnaire
              .formData as unknown as FormData;
            const savedSelections = profile.actionPlanner.questionnaire
              .selectedItems as unknown as FormSelections; // We need to store this too

            if (savedData) {
              setInitialData(savedData);
            }
            if (savedSelections) {
              setInitialSelections(savedSelections);
            }

            // Optional: Auto-show results?
            // For now, let's just pre-fill the form so the user can review and submit ("Edit" flow effectively).
            // If we want Direct Result, we'd need to run classification here.
          }
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, [user, supabase]);

  const [planGeneratedAt, setPlanGeneratedAt] = useState<number>(0);

  const handleSubmit = (data: FormData, selectedItems: FormSelections = {}) => {
    // Classify the situation based on form data
    const classificationResult = classifySituation(data);
    setClassification(classificationResult);

    // Convert selected items to array of keys for the action plan generator
    const selectedItemsArray = Object.keys(selectedItems).filter(
      (key) => selectedItems[key as keyof FormSelections],
    );

    // Generate the action plan based on classification and selected 221(g) items
    const plan = generateActionPlan(classificationResult, selectedItemsArray);
    setActionPlan(plan);
    setFormData(data);
    setSelectedItems(selectedItems);
    setPlanGeneratedAt(Date.now()); // Set timestamp when new plan is generated

    // Show the results
    setShowResults(true);
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  const handleSaveToProfile = async () => {
    if (!user || !formData) return;

    try {
      // We save the inputs so we can restore them
      const actionPlannerData = {
        questionnaire: {
          formData,
          selectedItems,
        },
        caseStatus: formData.ceacStatus,
        interviewDate: formData.interviewDate,
      };

      // We need to fetch existing profile to merge?
      // Or just upsert with patch?
      // Supabase upsert replaces unless we merge manually if JSONB.
      // But we can read-modify-write as we do in other tools.
      // Actually, we should fetch first to be safe or rely on merge if configured.
      // The safest pattern we used elsewhere was fetch -> merge -> update.
      // Or generic `upsert` if we can assume top-level merge.
      // Let's use the pattern from VisaEligibility where we probably should fetch.
      // But for now let's assume we can patch or we'll overwrite other tools' data?
      // Wait! Converting the ENTIRE profile_details column?
      // Supabase `update` on JSONB column might overwrite if not careful.
      // We should fetch first.

      const { data: currentData } = await supabase
        .from("user_profiles")
        .select("profile_details")
        .eq("id", user.id)
        .single();

      const currentProfile = currentData?.profile_details || {};

      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        profile_details: {
          ...currentProfile,
          actionPlanner: actionPlannerData,
        },
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (err) {
      console.error("Error saving to profile", err);
      throw err;
    }
  };

  return (
    <div className="container mx-auto py-4 px-2 md:py-8 md:px-4 max-w-4xl">
      {!showResults ? (
        <CombinedIntakeFormWrapper
          onSubmit={handleSubmit}
          initialData={initialData}
          initialSelections={initialSelections}
        />
      ) : (
        <ActionPlanResults
          classification={classification}
          actionPlan={actionPlan}
          formData={formData}
          selectedItems={selectedItems}
          onBackToForm={handleBackToForm}
          onSaveToProfile={handleSaveToProfile}
          planGeneratedAt={planGeneratedAt}
        />
      )}
    </div>
  );
}
