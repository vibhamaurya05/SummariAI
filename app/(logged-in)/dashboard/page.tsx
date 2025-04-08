import EmptySummary from "@/app/components/summary/empty-summary";
import SummaryCard from "@/app/components/summary/summary-card";
import { Button } from "@/components/ui/button";
import { getSummaries } from "@/lib/summaries";
import { ArrowRight, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const uploadLimit = 5;

  // const summaries = [
  //     {
  //         id:1,
  //         title:'abhishek',
  //         status:'completed',
  //         Description:"this is going to be description",
  //         createdAt: '2025-03-29 20:53:10.759642+00',
  //         summary_text:"this is going to be summary_text"
  //     },
  //     {
  //         id:2,
  //         title:'abhishek',
  //         status:'pending',
  //         Description:"this is going to be description",
  //         createdAt: '2025-03-29 20:53:10.759642+00',
  //         summary_text:"this is going to be summary_text"
  //     }
  // ]

  const summaries =
    (await getSummaries("123e4567-e89b-12d3-a456-426614174000")) || [];
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2  flex justify-between">
          {/* // heading  */}
          <div className="flex flex-col gap-2 ">
            <h1 className="text-5xl font-bold capitalize tracking-tight">
              Your summaries
            </h1>
            <p className="tracking-wide text-stone-600">
              Transform Your PDF's into consice, actionable insights
            </p>
          </div>
          {/* //button  */}
          <div className="hidden sm:block">
            <Button
              variant={"link"}
              className="bg-stone-950 hover:bg-stone-800 hover:no-underline"
            >
              <Link href="/uploads" className="flex items-center gap-1 text-white">
                <PlusIcon size={16} />
                New Summary
              </Link>
            </Button>
          </div>
        </div>
        <div className="sm:hidden mb-12">
            <Button
              variant={"link"}
              className="bg-stone-950 hover:bg-stone-800 hover:no-underline"
            >
              <Link href="/uploads" className="flex items-center gap-1 text-white">
                <PlusIcon size={16} />
                New Summary
              </Link>
            </Button>
          </div>
        {/* // limit warning  */}

        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
          <p>
            You've reached the limit of {uploadLimit} uploads on the basic plan.
            <Link
              href="/#pricing"
              className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center px-1"
            >
              Click here to upgrade to pro{" "}
              <ArrowRight className="w-4 h-4 inline-block" />
            </Link>
            for unlimited uploads
          </p>
        </div>
      {summaries.length === 0 ? (
        <EmptySummary/>):(
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
