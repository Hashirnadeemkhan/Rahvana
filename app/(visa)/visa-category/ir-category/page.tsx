"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPinned, PlayCircle } from "lucide-react";
import Link from "next/link";

// ✅ Props type for item rows
type IRItem = {
  title: string;
  description: string;
  videoLabel: string;
  roadmapLabel: string;
  roadmapLink: string;
};

// ✅ Main component
export default function IRCategorySection() {
  // IR Category items
  const items: IRItem[] = [
    {
      title: "IR-1",
      description:
        "This category applies to the spouse of a U.S. citizen. The process involves documentation, sponsorship, and consular interview steps. Our guide helps you every step of the way.",
      videoLabel: "Watch IR-1 Explainer Video",
      roadmapLabel: "View IR-1 Roadmap",
      roadmapLink: "/ir-1-roadmap",
    },
    {
      title: "IR-5",
      description:
        "The IR-5 visa is for parents of U.S. citizens aged 21 or older. We simplify the complex process by explaining each form, eligibility requirement, and timeline clearly.",
      videoLabel: "Watch IR-5 Explainer Video",
      roadmapLabel: "View IR-5 Roadmap",
      roadmapLink: "/ir-5-roadmap",
    },
  ];

  return (
    <section id="ir-category" className="container mx-auto px-6 py-20">
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-primary/90 tracking-wide">
          IMMEDIATE RELATIVE (IR) CATEGORY
        </h2>
      </div>

      {/* Description */}
      <div className="mx-auto mt-8 max-w-5xl rounded-xl border border-gray-200 bg-white text-gray-700 p-6 md:p-10 shadow-md">
        <p className="text-pretty leading-relaxed text-center">
          Learn about Immediate Relative (IR) visa categories. Understand
          eligibility, timelines, and how our assistant helps you step-by-step
          to complete your forms accurately with guidance and care.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-blue-200 my-12" />

      {/* IR Item Rows */}
      {items.map((item, index) => (
        <div key={index}>
          <IRItemRow {...item} />
          {index !== items.length - 1 && (
            <div className="border-t border-blue-200 my-12" />
          )}
        </div>
      ))}

      {/* Hidden anchors (optional for scroll links) */}
      <div id="consultancy" className="sr-only">Consultancy section anchor</div>
      <div id="contact" className="sr-only">Contact section anchor</div>
    </section>
  );
}

// ✅ Reusable Item Row component
function IRItemRow({
  title,
  description,
  videoLabel,
  roadmapLabel,
  roadmapLink,
}: IRItem) {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Left: Text content */}
      <div className="space-y-5">
        <Card className="border-blue-100 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-2xl font-semibold text-primary/90">{title}</div>
            <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
          </CardContent>
        </Card>

        <Button
          asChild
          className="gap-2 bg-primary/90 hover:bg-primary/100 text-white rounded-md shadow-md"
        >
          <Link href={roadmapLink}>
            <MapPinned className="h-4 w-4" />
            {roadmapLabel}
          </Link>
        </Button>
      </div>

      {/* Right: Video placeholder */}
      <Card className="hover:shadow-lg border-blue-100 transition-all duration-200">
        <CardContent className="p-4">
          <div
            className="aspect-video w-full rounded-md bg-gradient-to-br from-gray-100 to-blue-50 grid place-items-center text-sm text-gray-500"
            aria-label={`${title} explainer video placeholder`}
          >
            <div className="flex flex-col items-center gap-2">
              <PlayCircle
                className="h-8 w-8 text-blue-500"
                aria-hidden="true"
              />
              <span className="font-medium">{videoLabel}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
