"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { InterviewPrepOutput, GeneratedQuestion } from "@/lib/interview-prep";

interface ResultPageProps {
  sessionId: string;
  results?: InterviewPrepOutput | null;
  onRestart: () => void;
}

interface AccordionItemProps {
  item: GeneratedQuestion;
  index: number;
}

const AccordionItem = ({ item, index }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg relative">
      <div
        className="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <span className="font-medium text-slate-800 truncate max-w-md">
            {item.question}
          </span>
        </div>
        <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Info
                  size={16}
                  className="text-gray-500 hover:text-gray-700"
                />
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  className="z-[9999] max-w-2xs rounded bg-slate-800 px-3 py-2 text-xs text-white shadow-lg"
                >
                  {item.tooltip}
                  <Tooltip.Arrow className="fill-slate-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
      </div>

      {isOpen && (
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-4">
              <strong>Category:</strong> {item.category}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Suggested Answer:
            </h4>
            <p className="text-slate-700">{item.suggestedAnswer}</p>
          </div>

          <div>
            <h4 className="font-medium text-slate-800 mb-2">Guidance:</h4>
            <p className="text-slate-600">{item.guidance}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const ResultPage = ({
  sessionId,
  results,
  onRestart,
}: ResultPageProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the passed results directly
  useEffect(() => {
    if (results === undefined || results === null) {
      setError("No results found. Please try again.");
      setLoading(false);
    }
  }, [results]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">
          Generating your interview preparation materials...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
        <Button
          onClick={onRestart}
          className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
        >
          Restart
        </Button>
      </div>
    );
  }

  if (results && results.questions) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Your Interview Preparation Materials
          </h2>
          <p className="text-slate-600">
            Below are the questions and answers tailored to your specific case
          </p>
        </div>

        <div className="space-y-3">
          {results.questions
            .filter((item: GeneratedQuestion) => item.applicable)
            .map((item: GeneratedQuestion, index: number) => (
              <AccordionItem key={index} item={item} index={index} />
            ))}
        </div>

        <div className="pt-6">
          <Button
            onClick={onRestart}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            Start New Interview Prep
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-slate-600">No results found. Please try again.</p>
      <Button
        onClick={onRestart}
        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
      >
        Restart
      </Button>
    </div>
  );
};
