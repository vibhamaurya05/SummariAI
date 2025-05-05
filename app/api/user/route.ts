import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })
  }

  return new Response(JSON.stringify({ user }), { status: 200 })
}
