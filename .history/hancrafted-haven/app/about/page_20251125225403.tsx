// src/app/about/page.tsx
import { neon } from "@neondatabase/serverless";
import LogoutButton from "../logout/LogoutButton";

export default async function AboutPage() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT name, role FROM team`;

  return (
    <main className="about-page">
       <div className="mt-6">
        <LogoutButton />
      </div>
      <h1>Meet Our Team</h1>
      <ul>
        {rows.map((row: any, i: number) => (
          <li key={i}>
            <strong>{row.name}</strong> — {row.role}
          </li>
        ))}
      </ul>
    </main>
  );
}