

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
  