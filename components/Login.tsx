// components/Login.tsx
"use client";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { user, login, logout } = useAuth();

  return (
    <div className="p-4 space-y-4 text-white">
      {user ? (
        <div className="space-y-2">
          <img src={user.photoURL} className="w-10 h-10 rounded-full" />
          <div>{user.displayName}</div>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
        </div>
      ) : (
        <button onClick={login} className="bg-green-600 px-4 py-2 rounded">Sign in with Google</button>
      )}
    </div>
  );
}
