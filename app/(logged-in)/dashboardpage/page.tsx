// app/(logged-in)/dashboard/page.tsx
import { createClient } from '@/lib/server';
import { get } from 'http';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  
  return (
    <main className="min-h-screen pt-24 px-4 text-white">
      {/* <h1 className="text-4xl font-bold">Welcome, {userEmail}</h1>
      <p className="mt-2">Your user ID: {userId}</p> */}
      {/* You can pass userId to your SummaryList component here */}
    </main>
  );
}
