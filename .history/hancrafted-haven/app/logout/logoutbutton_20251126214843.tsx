"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
   // delete token from localStorage or cookie
    localStorage.removeItem("token");

    // Redirect the user to login
    router.push("/login");
  };

  return (
   <button onClick={handleLogout} className="logout-button">
  Logout
</button>

  );
}