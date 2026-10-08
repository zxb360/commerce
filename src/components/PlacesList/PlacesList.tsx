import React, { useState } from 'react'
import type { Establishment } from '../../types/commerce'
import { PlaceCard } from './PlaceCard'
import { CategoryFilter } from './CategoryFilter'
import { Store, Sparkles, FilterX } from 'lucide-react'

interface PlacesListProps {
  places: Establishment[]
  allCategories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  hoveredPlaceId: string | null
  selectedPlaceId: string | null
  onHoverPlace: (id: string | null) => void
  onSelectPlace: (id: string) => void
  onClearFilters?: () => void
}

export const PlacesList: React.FC<PlacesListProps> = ({
  places,
  allCategories,
  selectedCategory,
  onSelectCategory,
  hoveredPlaceId,
  selectedPlaceId,
  onHoverPlace,
  onSelectPlace,
  onClearFilters,
}) => {
  const [onlyOpenNow, setOnlyOpenNow] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'default'>('default')

  // Aplicação de filtros internos (Apenas abertos e ordenação)
  const filteredPlaces = places
    .filter((place) => (onlyOpenNow ? place.isOpen : true))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount
      return 0
    })

  return (
    <div className="h-full flex flex-col bg-slate-50/70">
      {/* Topo da lista: filtros de categoria e controles rápidos */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 py-3.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800">
              Estabelecimentos
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {filteredPlaces.length}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Toggle apenas abertos */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 select-none">
              <input
                type="checkbox"
                checked={onlyOpenNow}
                onChange={(e) => setOnlyOpenNow(e.target.checked)}
                className="w-3.5 h-3.5 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Abertos agora</span>
            </label>

            {/* Ordenação rápida */}
            <select
              aria-label="Ordenar estabelecimentos"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'rating' | 'reviews' | 'default')
              }
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="default">Padrão</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="reviews">Mais Avaliados</option>
            </select>
          </div>
        </div>

        {/* Carrossel de Categorias */}
        <CategoryFilter
          categories={allCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* Conteúdo rolável contendo o grid de cards */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {filteredPlaces.map((place) => {
              const isSelected = selectedPlaceId === place.id
              const isHovered = hoveredPlaceId === place.id

              return (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  onMouseEnter={() => onHoverPlace(place.id)}
                  onMouseLeave={() => onHoverPlace(null)}
                  onClick={() => onSelectPlace(place.id)}
                />
              )
            })}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="h-96 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Store className="w-7 h-7" />
            </div>
            <h4 className="font-semibold text-slate-800 text-base mb-1">
              Nenhum comércio encontrado
            </h4>
            <p className="text-slate-500 text-xs max-w-sm mb-4">
              Não encontramos resultados com os filtros ou termo de busca
              selecionados. Tente ajustar os filtros para ver mais locais.
            </p>
            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <FilterX className="w-3.5 h-3.5" />
                Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* Rodapé informativo discreto da lista */}
        {filteredPlaces.length > 0 && (
          <div className="mt-8 mb-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200/60 rounded-full text-[11px] text-slate-500">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>Você visualizou todos os {filteredPlaces.length} locais disponíveis</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
