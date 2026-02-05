import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/admin/login", "/admin/register"];

// Routes that are part of onboarding
const ONBOARDING_ROUTES = ["/admin/onboarding"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isOnboardingRoute = ONBOARDING_ROUTES.includes(pathname);

    // Allow access to public routes (login, register) if not authenticated
    if (isPublicRoute) {
      if (user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from("profiles")
          .select("shop_id")
          .eq("id", user.id)
          .single();

        if (profile?.shop_id) {
          // Check if shop is onboarded
          const { data: shop } = await supabase
            .from("shops")
            .select("is_onboarded")
            .eq("id", profile.shop_id)
            .single();

          if (shop?.is_onboarded) {
            // Fully onboarded, go to dashboard
            return NextResponse.redirect(new URL("/admin", request.url));
          }
        }
        // Not fully onboarded, go to onboarding
        return NextResponse.redirect(new URL("/admin/onboarding", request.url));
      }
      return supabaseResponse;
    }

    // Protect all other admin routes
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Handle onboarding route access
    if (isOnboardingRoute) {
      // Allow access to onboarding
      return supabaseResponse;
    }

    // For protected routes, check onboarding status
    const { data: profile } = await supabase
      .from("profiles")
      .select("shop_id")
      .eq("id", user.id)
      .single();

    if (!profile?.shop_id) {
      // No shop, redirect to onboarding
      return NextResponse.redirect(new URL("/admin/onboarding", request.url));
    }

    // Check if shop is onboarded
    const { data: shop } = await supabase
      .from("shops")
      .select("is_onboarded")
      .eq("id", profile.shop_id)
      .single();

    if (!shop?.is_onboarded) {
      // Shop exists but not fully onboarded
      return NextResponse.redirect(new URL("/admin/onboarding", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Only match admin routes that need auth protection.
     * This prevents middleware from running on static pages and API routes.
     */
    "/admin/:path*",
  ],
};
