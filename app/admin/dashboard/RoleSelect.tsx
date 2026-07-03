"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Check } from "lucide-react";

export default function RoleSelect({ userId, initialRole }: { userId: string, initialRole: string }) {
  const [role, setRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const supabase = createClient();

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRole(newRole);
    setIsLoading(true);
    setShowSuccess(false);

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    setIsLoading(false);

    if (error) {
      alert("Failed to update role: " + error.message);
      setRole(initialRole); // Revert on failure
    } else {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={handleRoleChange}
        disabled={isLoading}
        className="block w-full pl-3 pr-10 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      
      {isLoading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
      {showSuccess && <Check className="w-4 h-4 text-green-500" />}
    </div>
  );
}
