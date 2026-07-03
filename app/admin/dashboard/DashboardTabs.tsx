"use client";

import { useState } from "react";
import RoleSelect from "./RoleSelect";
import CategoryManager from "./CategoryManager";
import CourseManager from "./CourseManager";
import SliderManager from "./SliderManager";
import { Users, FolderTree, BookOpen, Image as ImageIcon } from "lucide-react";

export default function DashboardTabs({ profiles, categories, courses, slides, authData }: any) {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "categories", label: "Categories", icon: <FolderTree className="w-4 h-4" /> },
    { id: "courses", label: "Courses", icon: <BookOpen className="w-4 h-4" /> },
    { id: "slider", label: "Hero Slider", icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 [&::-webkit-scrollbar]:hidden">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "users" && (
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
                  {profiles?.map((userProfile: any) => (
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
        )}

        {activeTab === "categories" && (
          <CategoryManager initialCategories={categories || []} />
        )}

        {activeTab === "courses" && (
          <CourseManager 
            initialCourses={courses || []} 
            categories={categories || []} 
            adminName={profiles?.find((p: any) => p.id === authData.user.id)?.full_name || "Admin"} 
          />
        )}

        {activeTab === "slider" && (
          <SliderManager initialSlides={slides || []} />
        )}
      </div>
    </div>
  );
}
