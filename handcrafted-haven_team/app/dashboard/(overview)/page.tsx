// app/dashboard/(overview)/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CustomerDashboard from '@/app/ui/dashboard/customer-dashboard';
import ArtisanDashboard from '@/app/ui/dashboard/artisan-dashboard';
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export default async function DashboardPage() {
  const session = await auth();

  // Redirect if unauthenticated
  if (!session?.user) {
    redirect('/login');
  }

  const accountType = (session.user as any).accountType;

  // CUSTOMER DASHBOARD LOGIC
  if (accountType === 'customer') {
    // Fetch all products
    const products = await sql`SELECT * FROM products`;

    // Pick a random one
    const featuredProduct = products.length
      ? products[Math.floor(Math.random() * products.length)]
      : null;

    // Get review count for this user (optional)
    const userId = session.user.id!;
    
    const reviewRows = await sql`SELECT COUNT(*) FROM reviews WHERE user_id = ${userId}`;

    const reviewCount = Number(reviewRows[0].count) || 0;

    return (
      <CustomerDashboard
        user={session.user}
        featuredProduct={featuredProduct}
        reviewCount={reviewCount}
      />
    );
  }

  // ARTISAN DASHBOARD
  if (accountType === 'artisan') {
    return <ArtisanDashboard user={session.user} />;
  }

  // FALLBACK (unknown account type)
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
      <p>Account type: {accountType || 'Not set'}</p>
    </div>
  );
}
