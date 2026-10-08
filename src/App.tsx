import { useState, useMemo } from 'react'
import { Header } from './components/Header/Header'
import { PlacesList } from './components/PlacesList/PlacesList'
import { InteractiveMap } from './components/Map/InteractiveMap'
import { ViewToggleButton } from './components/MobileToggle/ViewToggleButton'
import { SEED_ESTABLISHMENTS } from './data/seedPlaces'
import type { ViewMode } from './types/commerce'

export function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [mobileViewMode, setMobileViewMode] = useState<ViewMode>('list')

  // Categorias únicas derivadas da lista de sementes
  const allCategories = useMemo(() => {
    const categoriesSet = new Set(SEED_ESTABLISHMENTS.map((p) => p.category))
    return Array.from(categoriesSet)
  }, [])

  // Filtragem combinada por busca e categoria selecionada
  const filteredPlaces = useMemo(() => {
    return SEED_ESTABLISHMENTS.filter((place) => {
      const matchesCategory =
        selectedCategory === 'all' || place.category === selectedCategory

      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchesCategory

      const matchesSearch =
        place.name.toLowerCase().includes(query) ||
        place.category.toLowerCase().includes(query) ||
        place.address.toLowerCase().includes(query) ||
        (place.tags && place.tags.some((tag) => tag.toLowerCase().includes(query)))

      return matchesCategory && matchesSearch
    })
  }, [searchQuery, selectedCategory])

  const handleSelectPlace = (id: string) => {
    setSelectedPlaceId((prev) => (prev === id ? null : id))
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
  }

  const toggleMobileView = () => {
    setMobileViewMode((prev) => (prev === 'list' ? 'map' : 'list'))
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* 1. Header fixo com 80px de altura (h-20) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredPlaces.length}
      />

      {/* 2. Container principal com altura calc(100vh - 80px) dividido em Split Screen */}
      <main className="flex-1 h-[calc(100vh-80px)] flex flex-col lg:flex-row relative overflow-hidden">
        {/* Coluna Esquerda (58% largura no desktop): Área rolável com lista e grid de cards */}
        <section
          aria-label="Lista de estabelecimentos"
          className={`w-full lg:w-[58%] xl:w-[60%] h-full flex flex-col overflow-hidden transition-all duration-300 ${
            mobileViewMode === 'map' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <PlacesList
            places={filteredPlaces}
            allCategories={allCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            hoveredPlaceId={hoveredPlaceId}
            selectedPlaceId={selectedPlaceId}
            onHoverPlace={setHoveredPlaceId}
            onSelectPlace={handleSelectPlace}
            onClearFilters={handleClearFilters}
          />
        </section>

        {/* Coluna Direita (42% largura no desktop): Container fixo com o mapa interativo */}
        <section
          aria-label="Mapa interativo"
          className={`w-full lg:w-[42%] xl:w-[40%] h-full relative border-l border-slate-200/90 transition-all duration-300 ${
            mobileViewMode === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <InteractiveMap
            places={filteredPlaces}
            hoveredPlaceId={hoveredPlaceId}
            selectedPlaceId={selectedPlaceId}
            onHoverPlace={setHoveredPlaceId}
            onSelectPlace={handleSelectPlace}
          />
        </section>

        {/* Mobile: Botão flutuante para alternar entre "Ver Mapa" e "Ver Lista" */}
        <ViewToggleButton
          viewMode={mobileViewMode}
          onToggle={toggleMobileView}
        />
      </main>
    </div>
  )
}

export default App
