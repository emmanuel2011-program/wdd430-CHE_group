"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
     // delete token from localStorage or cookie
    localStorage.removeItem("token");

     // Redirect the user to login
    router.push("/login");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
      <p className="text-gray-500">Please wait a moment.</p>
    </div>
  );
}
