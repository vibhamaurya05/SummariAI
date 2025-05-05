import { Card } from "@/components/ui/card";
import DeleteButton from "./Deletebutton";
import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type Summary = {
  id: string;
  original_file_url: string;
  title: string | null;
  createdAt: string | Date; // <-- allow string or Date
  summary_text: string;
  status: "COMPLETED" | "PROCESSING" | string;
};

const SummaryHeader = ({
  title,
  createdAt,
}: {
  title: string | null;
  createdAt: string;
}) => {
  return (
    <div className="flex items-start gap-2 sm:gap-4">
      <FileText className="w-6 h-6 sm:w-8 text-rose-400 mt-1" />
      <div className="flex-1 min-w-0">
        <h3 className="text-base xl:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate w-4/5">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={cn(
        "px-3 py-1 text-xs rounded-full capitalize",
        status === "COMPLETED"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      )}
    >
      {status}
    </span>
  );
};

export default function SummaryCard({ summary }: { summary: Summary }) {
  return (
    <div>
      <Card className="relative h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 ">
        <div className="absolute top-2 right-2">
          <DeleteButton summaryId={summary.id} />
        </div>
        <Link
          href={`summaries/${summary.id}`}
          className="block p-4 sm:p-6 "
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <SummaryHeader
              title={summary.title}
              createdAt={summary.createdAt.toString()}
            />
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm sm:text-base pl-2">
              {summary.summary_text}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2 sm:mt-4">
            <StatusBadge status={summary.status} />
          </div>
        </Link>
      </Card>
    </div>
  );
}
