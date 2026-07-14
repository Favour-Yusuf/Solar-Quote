import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_TYPES = ["signup", "invite", "magiclink", "recovery", "email_change", "email"] as const;
type OtpType = (typeof VALID_TYPES)[number];

function isOtpType(value: string | null): value is OtpType {
  return !!value && (VALID_TYPES as readonly string[]).includes(value);
}

/**
 * Landing target for Supabase's confirmation-email link. The Supabase
 * dashboard's "Confirm signup" template must point here:
 * {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (tokenHash && isOtpType(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}/login?verified=1`);
    }
  }

  return NextResponse.redirect(`${origin}/verify-email?error=1`);
}
