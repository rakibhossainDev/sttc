import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardTabs from "./DashboardTabs";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Ensure fresh data on load

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
    redirect("/admin");
  }

  // 3. Fetch all required data for the dashboard
  const [
    { data: profiles },
    { data: categories },
    { data: courses },
    { data: slides }
  ] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("id", { ascending: true }),
    supabase.from("courses").select("*").order("id", { ascending: false }),
    supabase.from("hero_slides").select("*").order("id", { ascending: false })
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage platform users, categories, courses, and landing page content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Link>
          </div>
        </div>

        {/* Dynamic Tabs */}
        <DashboardTabs 
          profiles={profiles} 
          categories={categories} 
          courses={courses} 
          slides={slides} 
          authData={authData} 
        />
        
      </div>
    </div>
  );
}
