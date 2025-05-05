"use client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { NavigationControls } from "./navigation-controls";
import ProgressEventBar from "./progress-bar";
import { parseSection } from "@/utils/summary-helper";
import ContentSection from "./content-section";

// Section title
const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="w-full items-center flex flex-col gap-2 mb-6 sticky top-0 pt-2 backdrop-blur-sm z-10">
      <h2 className="text-lg sm:text-3xl lg:text-4xl flex items-center gap-2 text-center font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
    </div>
  );
};

export function SummaryViewer({ summary }: { summary: string }) {
  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));

  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  // Parse summary
  const sections = summary
    .split("\n# ")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);

  return (
    <Card className="relative px-2 h-[500px] sm:h-[600px] lg:h-[700px] w-full xl:w-[600px] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-950 backdrop-blur-sm border border-blue-500/10 dark:border-zinc-700 shadow-lg shadow-blue-500/20 dark:shadow-none transition-colors text-gray-900 dark:text-white">
      {/* Progress Bar */}
      <ProgressEventBar
        sections={sections.map((section) => section.title)}
        currentSection={currentSection}
      />

      <div className="h-full overflow-y-auto scrollbar-hide pt-4 sm:pt-16 pb-24">
        <div className="w-full sm:px-6 px-4">
          {" "}
          {/* <- Add padding on small screens */}
          <SectionTitle title={sections[currentSection].title} />
          <ContentSection
            title={sections[currentSection]?.title || ""} // Safe check for title
            points={
              Array.isArray(sections[currentSection]?.points)
                ? sections[currentSection]?.points
                : []
            } // Ensure points is always an array
          />
        </div>
      </div>

      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelectSelect={setCurrentSection}
      />
    </Card>
  );
}
