import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UploadSidebar from "../components/custome/upload-sidebar";

export default function UploadLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        // <SidebarProvider >
        // <UploadSidebar />
        <main className=" w-full mt-20">
          {/* <SidebarTrigger /> */}
          {children}
        </main>
      // </SidebarProvider>
    );
  }
  