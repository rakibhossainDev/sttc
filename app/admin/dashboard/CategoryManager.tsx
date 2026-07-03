"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, Loader2 } from "lucide-react";

export default function CategoryManager({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: newCategory.trim() }])
      .select()
      .single();

    if (error) {
      alert("Error adding category: " + error.message);
    } else if (data) {
      setCategories([...categories, data]);
      setNewCategory("");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting category: " + error.message);
    } else {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Manage Categories</h2>
      
      <form onSubmit={handleAddCategory} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name..."
          className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !newCategory.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No categories found.</p>
        )}
      </div>
    </div>
  );
}
