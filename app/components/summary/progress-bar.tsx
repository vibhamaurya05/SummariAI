import { cn } from "@/lib/utils";

export default function ProgressEventBar({
  sections,
  currentSection,
}: {
  sections: string[]; // Ensure this is an array of strings (titles)
  currentSection: number;
}) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-accent-200/50 backdrop-blur-xs pt-4 pb-2 border-b border-blue-500/10">
      <div className="px-4 flex gap-1.5">
        {sections.map((section, index) => (
          <div key={index} className="h-1.5 flex-1 rounded-full bg-blue-100 overflow-hidden">
            <div
              className={cn(
                `h-full bg-linear-to-r from-gray-500 to-blue-600 transition-all duration-500`,
                index === currentSection
                  ? "w-full"
                  : currentSection > index
                  ? "w-full opacity-10"
                  : "w-0"
              )}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
