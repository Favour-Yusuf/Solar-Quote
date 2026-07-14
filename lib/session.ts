import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getCompanyByOwnerId } from "@/services/companies";

/**
 * Cached per-request so the auth check + company lookup only run once even
 * though the dashboard layout and every page under it call this.
 */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [dbUser, company] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    getCompanyByOwnerId(user.id),
  ]);

  return { user, dbUser, company };
});

/**
 * Guard for every route under app/(dashboard). Also the single place that
 * derives `companyId` from the authenticated session — every Prisma query
 * in services/* is scoped to it, since Prisma itself runs with full DB
 * privileges and doesn't enforce row-level ownership on its own.
 */
export async function requireOnboardedCompany() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (!session.company?.onboardedAt) {
    redirect("/onboarding");
  }
  return {
    user: session.user,
    dbUser: session.dbUser,
    company: session.company,
  };
}
