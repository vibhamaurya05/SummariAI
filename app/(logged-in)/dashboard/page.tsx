import React from 'react';
import { ArrowRight, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';

import { getSummaries } from "@/lib/summaries";
import EmptySummary from '@/app/components/summary/empty-summary';
import SummaryCard from '@/app/components/summary/summary-card';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';

const SummaryList = ({ userId }: { userId: string }) => {
  return (
    <Suspense fallback={<div className="text-center">Loading summaries...</div>}>
      {userId ? (
        <FetchSummaries userId={userId} />
      ) : (
        <div className="text-center">No user ID available. Please log in.</div>
      )}
    </Suspense>
  );
};

const FetchSummaries = async ({ userId }: { userId: string }) => {
  const summaries = await getSummaries(userId);
  if (!summaries || summaries.length === 0) {
    return <EmptySummary />;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 ms:px-0">
      {summaries.map((summary: any, index: number) => (
        <SummaryCard key={index} summary={summary} />
      ))}
    </div>
  );
};

export default async function Dashboard() {
  const uploadLimit = 5;

 const supabase = await createClient()
 const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        return redirect('/auth/login')
      }

  const userId = user.id; // Get the user ID from the session
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 pb-4 transition-colors duration-300 px-4 sm:px-0">
      <div className="max-w-7xl mx-auto flex flex-col gap-4  px-4">

        {/* Header */}
        <div className="px-4 flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
              Your summaries
            </h1>
            <p className="tracking-wide text-stone-600 dark:text-stone-300">
              Transform Your PDFs into concise, actionable insights
            </p>
          </div>

          {/* New Summary Button (desktop) */}
          <div className="hidden sm:block">
            <Link href="/summaryAI/upload-pdf">
              <Button className="flex gap-2 items-center">
                <PlusIcon size={16} />
                New Summary
              </Button>
            </Link>
          </div>
        </div>

        {/* New Summary Button (mobile) */}
        <div className="sm:hidden mb-12">
          <Button>
            <Link href="/summaryAI/upload-pdf" className="flex gap-2 items-center">
              <PlusIcon size={16} />
              New Summary
            </Link>
          </Button>
        </div>

        {/* Upload Limit Warning */}
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-blue-800 dark:text-blue-100">
          <p>
            You&apos;ve reached the limit of {uploadLimit} uploads on the basic plan.
            <Link
              href="/#pricing"
              className="text-blue-800 dark:text-blue-100 underline font-medium underline-offset-4 inline-flex items-center pr-1"
            >
              Click here to upgrade to pro{" "}
              <ArrowRight className="w-4 h-4 inline-block" />
            </Link>
            for unlimited uploads.
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryList userId={userId} />
      </div>
    </main>
  );
}
