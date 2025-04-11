import EmptySummary from "@/app/components/summary/empty-summary";
import SummaryCard from "@/app/components/summary/summary-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/client";
import { getSummaries } from "@/lib/summaries";
import { ArrowRight, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const uploadLimit = 5;
  const supabase = createClient()
  const {data} = await supabase.auth.getUser() 
  const userId = data?.user?.id;
  const summaries = userId ? await getSummaries(userId) : [];
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 pb-4 transition-colors duration-300 px-4 sm:px-0">
      <div className="container mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="px-2 flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
              Your summaries
            </h1>
            <p className="tracking-wide text-stone-600 dark:text-stone-300">
              Transform Your PDFs into concise, actionable insights
            </p>
          </div>

          {/* New Summary Button (visible on sm+) */}
          <div className="hidden sm:block">
            <Button
             
            >
              <Link href="/uploads" className="flex gap-2 items-center" >
                <PlusIcon size={16} />
                New Summary
              </Link>
            </Button>
          </div>
        </div>

        {/* New Summary Button (mobile) */}
        <div className="sm:hidden mb-12">
          <Button
           
          >
            <Link href="/uploads" className="flex gap-2 items-center">

              <PlusIcon size={16} />
              New Summary

            </Link>
          </Button>
        </div>

        {/* Upload Limit Warning */}
        <div className="bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 rounded-lg p-4 text-rose-800 dark:text-rose-100">
          <p>
            You've reached the limit of {uploadLimit} uploads on the basic plan.
            <Link
              href="/#pricing"
              className="text-rose-800 dark:text-rose-100 underline font-medium underline-offset-4 inline-flex items-center pr-1"
            >Click here to upgrade to pro{" "}
              <ArrowRight className="w-4 h-4 inline-block" />
            </Link>
            for unlimited uploads.
          </p>
        </div>

        {/* Summary Cards or Empty */}
        {summaries.length === 0 ? (
          <EmptySummary />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 ms:px-0">
            {summaries.map((summary, index) => (
              <SummaryCard key={index} summary={summary} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
