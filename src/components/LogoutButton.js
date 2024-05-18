"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <div className="logout-container">
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="logout-button"
      >
        ログアウト
      </button>
      <style jsx>{`
        .logout-container {
          display: grid;
          place-items: center;
          margin-right: 8px;
        }
        .logout-button {
          background-color: #e53e3e; /* Tailwind bg-red-600 */
          padding: 8px 16px; /* Tailwind px-4 py-2 */
          border-radius: 6px; /* Tailwind rounded-md */
          color: white;
          font-size: 12px;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s;
        }
        .logout-button:hover {
          background-color: #c53030; /* Tailwind hover:bg-red-700 */
        }
      `}</style>
    </div>
  );
}
