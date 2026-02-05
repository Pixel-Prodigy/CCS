import { Sidebar } from "@/components/admin/sidebar";
import { getUser, getShop } from "@/lib/actions/auth";

// Force dynamic rendering to prevent prerender errors with auth
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const shop = await getShop();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userEmail={user?.email} shopName={shop?.name} />
      <main className="md:pl-64 transition-all duration-300">
        <div className="p-4 pt-20 md:pt-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
