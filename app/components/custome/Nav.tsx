"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/client";

export default function Nav() {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      setUser(data.user);
    };
    getUser();
    const getsession = async () => {
      const { data } = await supabase.auth.getSession();    
     
    }
    getsession()
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session?.user ?? null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          toast.success("Logged out");
          router.push("/auth/login"); 
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    }
    
  };

  const navLinkClass = (path: string) =>
    `px-3 py-1 rounded-full transition-all text-sm duration-200 ${
      pathname === path
        ? "border border-gray-300 bg-white text-black"
        : "hover:border hover:border-gray-300 hover:bg-white/70 hover:text-black"
    }`;

  return (
    <div className="fixed top-5 left-0 right-0 z-50 px-4">
      <div
        className={`transition-all duration-300 mx-auto ${
          scrolled
            ? "max-w-3xl rounded-xl shadow-md border border-blue-300/30 bg-white/70 dark:bg-black/70 backdrop-blur-md"
            : "max-w-7xl border-none bg-white/0 dark:bg-black/0"
        }`}
      >
        <div className="flex items-center justify-between py-2 px-3">
          {/* Logo */}
          <Link href="/" className="flex gap-2 items-center">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-10 rounded-full h-auto"
            >
              <source src="/ai-logo.mp4" type="video/mp4" />
            </video>
            <span className="text-xl font-bold">Brainwave</span>
          </Link>

          {/* Links */}
          <div
            className={`hidden md:flex text-lg gap-4 items-center ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            <Link
              href="/summaryAI/upload-pdf"
              className={navLinkClass("/summaryAI/upload-pdf")}
            >
              PDF Summary
            </Link>
            <Link href="/summaryAI" className={navLinkClass("/summariAI")}>
              Chat with Own Data
            </Link>
          </div>

          {/* Auth & Theme */}
          <div className="flex items-center gap-2">
            {user ? (
              <Button className="cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-400 px-6 py-3" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link href="/auth/login">
                <Button className="cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-400 px-6 py-3">Login</Button>
              </Link>
            )}

            <div
              className="cursor-pointer p-1 rounded-full border border-stone-200/30"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
