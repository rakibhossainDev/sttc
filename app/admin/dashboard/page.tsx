import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RoleSelect from "./RoleSelect";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Verify User is Authenticated
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect("/admin");
  }

  // 2. Verify User is Admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    // If somehow a non-admin gets here, kick them out
    redirect("/admin");
  }

  // 3. Fetch all profiles for the dashboard
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage platform users and permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Link>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Full Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Joined</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white w-48">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {profiles?.map((userProfile) => (
                  <tr key={userProfile.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {userProfile.full_name || "Unknown"}
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      {userProfile.email}
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {new Date(userProfile.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {/* Ignore changing own role to prevent self-lockout */}
                      {userProfile.id === authData.user.id ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          You (Admin)
                        </span>
                      ) : (
                        <RoleSelect userId={userProfile.id} initialRole={userProfile.role} />
                      )}
                    </td>
                  </tr>
                ))}
                
                {(!profiles || profiles.length === 0) && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
