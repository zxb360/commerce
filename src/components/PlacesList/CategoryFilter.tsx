import React from 'react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar text-xs font-medium scroll-smooth">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer ${
          selectedCategory === 'all'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        Todos os locais
      </button>

      {categories.map((cat) => {
        const isActive = selectedCategory === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
