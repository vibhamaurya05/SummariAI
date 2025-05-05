import { createClient } from '@supabase/supabase-js'

// ✅ Create the client once and reuse it
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
