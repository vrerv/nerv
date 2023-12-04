import { createClient } from '@supabase/supabase-js'
import { Database } from "@/lib/api/database.types";

export const supabase = createClient<Database>(
// @ts-ignore
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)