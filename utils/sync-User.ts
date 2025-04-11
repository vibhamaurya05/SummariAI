// utils/syncUser.ts
"use server";
import { createClient } from "@/lib/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function syncUserWithDatabase() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.warn("No user found from Supabase Auth");
    return null;
  }

  const { id, email, user_metadata } = data.user;
  const full_name = user_metadata?.full_name || "Anonymous";

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id,
        email: email ?? 'example@gmail.com',
        full_name,
        status: "ACTIVE", 
      },
    });
    console.log("✅ User created in Prisma DB");
  }

  return id;
}
