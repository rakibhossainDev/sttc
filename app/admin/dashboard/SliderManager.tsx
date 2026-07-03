"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, Loader2, Eye, EyeOff } from "lucide-react";

export default function SliderManager({ initialSlides }: { initialSlides: any[] }) {
  const [slides, setSlides] = useState(initialSlides);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from('hero_slides')
      .insert([{ image_url: imageUrl.trim(), is_active: true }])
      .select()
      .single();

    if (error) {
      alert("Error adding slide: " + error.message);
    } else if (data) {
      setSlides([data, ...slides]);
      setImageUrl("");
    }
    setIsLoading(false);
  };

  const handleToggleVisibility = async (id: number, currentStatus: boolean) => {
    // Optimistic UI update
    setSlides(slides.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));

    const { error } = await supabase
      .from('hero_slides')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      alert("Error updating visibility: " + error.message);
      // Revert if failed
      setSlides(slides.map(s => s.id === id ? { ...s, is_active: currentStatus } : s));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting slide: " + error.message);
    } else {
      setSlides(slides.filter(s => s.id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Manage Hero Slider</h2>
      
      <form onSubmit={handleAddSlide} className="flex gap-3 mb-6">
        <input
          type="url"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="New Image URL (https://...)"
          className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !imageUrl.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Slide
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide) => (
          <div key={slide.id} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            <img 
              src={slide.image_url} 
              alt="Slide Thumbnail" 
              className={`w-full h-32 object-cover transition-opacity ${!slide.is_active ? 'opacity-40 grayscale' : ''}`}
            />
            
            {!slide.is_active && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">HIDDEN</span>
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleToggleVisibility(slide.id, slide.is_active)}
                className="bg-white/90 dark:bg-gray-900/90 hover:bg-white p-2 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 transition-colors backdrop-blur-sm"
                title={slide.is_active ? "Hide Slide" : "Show Slide"}
              >
                {slide.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
                className="bg-white/90 dark:bg-gray-900/90 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg shadow-sm text-red-500 transition-colors backdrop-blur-sm"
                title="Delete Slide permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            No slides available. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
