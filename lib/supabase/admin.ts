import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS — server-only, never import
 * this from a Client Component. Used for privileged Storage operations
 * (company logo uploads) and the public, no-auth quote share route.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
