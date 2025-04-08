import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { FileText, Globe, Pencil, Sparkles } from "lucide-react";

export default function UploadSidebar() {
  return (
    <Sidebar className="min-h-screen bg-rose-100 border-r border-rose-200 shadow-sm">
      {/* Site Name */}
      <SidebarHeader className="mt-12 pl-4">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Summary-Chat
        </h1>
        <p className="text-sm mb-12 font-medium">
          Your AI-powered assistant
        </p>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="pl-4">
        <SidebarGroup>
          <ul className="flex flex-col gap-2">
            <Link href="/summaryAI/upload-pdf" passHref>
              <li className="flex gap-2 hover:bg-rose-200 font-medium px-4 py-2 rounded-lg transition-all duration-200 items-center cursor-pointer">
                <FileText className="h-4 w-4 text-rose-600" />
                Upload PDF
              </li>
            </Link>

            <Link href="/summaryAI/web-url" passHref>
              <li className="flex gap-2 hover:bg-rose-200 font-medium px-4 py-2 rounded-lg transition-all duration-200 items-center cursor-pointer">
                <Globe className="h-4 w-4 text-rose-600" />
                Paste Web URL
              </li>
            </Link>

            <Link href="/summaryAI/write-text" passHref>
              <li className="flex gap-2 hover:bg-rose-200 font-medium px-4 py-2 rounded-lg transition-all duration-200 items-center cursor-pointer">
                <Pencil className="h-4 w-4 text-rose-600" />
                Write Text
              </li>
            </Link>

            <Link href="/summaryAI" passHref>
              <li className="flex gap-2 hover:bg-rose-200 font-medium px-4 py-2 rounded-lg transition-all duration-200 items-center cursor-pointer">
                <Sparkles className="h-4 w-4 text-rose-600" />
                Ask AI Freely
              </li>
            </Link>
          </ul>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Message */}
      <SidebarFooter className="pl-4 mt-auto pb-6">
        <p className="text-xs max-w-[180px] leading-5">
          Made with 💡 to help you learn, explore, and chat smarter.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
