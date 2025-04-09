import { SourseInfo } from "@/app/components/summary/sourse-info";
import { SummaryViewer } from "@/app/components/summary/summary-vew";
import { SummaryHeader } from "@/app/components/summary/summaryheader";
import { getSummariesById } from "@/lib/summaries";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";

export default async function SummaryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const summary = await getSummariesById(id);

  if (!summary) {
    notFound();
  }

  return (
    <div className="relative isolate min-h-screen px-4 sm:px-0 pt-16 bg-gradient-to-b from-blue-50/40 to-white dark:from-zinc-900 dark:to-zinc-950 transition-colors">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <div className="flex flex-col">
            <SummaryHeader title={summary.title} createdAt={summary.createdAt} />
          </div>

          <SourseInfo
            file_name={summary.file_name}
            original_file_url={summary.original_file_url}
            title={summary.title}
            createdAt={summary.createdAt}
            summary_text={summary.summary_text}
          />

          <div className="relative mt-4 sm:mt-8 lg:mt-16 w-full">
            <div className="relative p-2 sm:p-6 lg:p-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-none border border-blue-100/30 dark:border-zinc-700 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-md hover:bg-white/90 dark:hover:bg-zinc-900/90 max-w-4xl mx-auto">

              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/90 dark:bg-zinc-800 dark:text-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                {/* {word_count?.toLocalString()} words */}
              </div>

              <div className="relative mt-8 sm:mt-6 flex justify-center">
                <SummaryViewer summary={summary.summary_text} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
