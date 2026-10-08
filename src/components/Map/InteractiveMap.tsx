import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { Establishment } from '../../types/commerce'
import { Navigation, Star, X, MapPin } from 'lucide-react'

interface InteractiveMapProps {
  places: Establishment[]
  hoveredPlaceId: string | null
  selectedPlaceId: string | null
  onHoverPlace: (id: string | null) => void
  onSelectPlace: (id: string) => void
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places,
  hoveredPlaceId,
  selectedPlaceId,
  onHoverPlace,
  onSelectPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map())
  const placesMapRef = useRef<Map<string, Establishment>>(new Map())

  // Referência atualizada para callbacks garantindo estabilidade
  const callbacksRef = useRef({ onHoverPlace, onSelectPlace })
  useEffect(() => {
    callbacksRef.current = { onHoverPlace, onSelectPlace }
  }, [onHoverPlace, onSelectPlace])

  // Sincroniza o mapa de consulta de places
  useEffect(() => {
    placesMapRef.current.clear()
    places.forEach((p) => placesMapRef.current.set(p.id, p))
  }, [places])

  // Criação do DivIcon customizado com logotipo circular do estabelecimento
  const createCustomDivIcon = (
    place: Establishment,
    isActive: boolean,
    isHovered: boolean
  ) => {
    const activeClass = isActive ? 'is-active' : ''
    const hoveredClass = isHovered ? 'is-hovered' : ''

    const htmlContent = `
      <div class="custom-marker-container ${activeClass} ${hoveredClass}" data-place-id="${place.id}">
        <div class="custom-marker-pin">
          <img src="${place.logo_image_url}" alt="${place.name}" loading="lazy" />
        </div>
        <div class="custom-marker-badge">${place.name}</div>
      </div>
    `

    return L.divIcon({
      html: htmlContent,
      className: 'custom-leaflet-marker',
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -24],
    })
  }

  // 1. Inicialização do Mapa Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [-23.5615, -46.6853],
      zoom: 14,
      zoomControl: false,
    })

    // Adiciona camada de mapas elegante (CartoDB Positron / Voyager para estilo limpo e moderno)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    ).addTo(map)

    // Controles de zoom no canto superior direito
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map)

    mapInstanceRef.current = map

    // Redimensionamento inteligente
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(mapContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // 2. Sincronização dos Marcadores no Mapa com a Lista de Estabelecimentos
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Limpa marcadores antigos
    markersMapRef.current.forEach((marker) => {
      marker.remove()
    })
    markersMapRef.current.clear()

    if (places.length === 0) return

    const bounds = L.latLngBounds([])

    places.forEach((place) => {
      const isSelected = selectedPlaceId === place.id
      const isHovered = hoveredPlaceId === place.id

      const icon = createCustomDivIcon(place, isSelected, isHovered)

      const marker = L.marker([place.latitude, place.longitude], {
        icon,
        title: place.name,
        zIndexOffset: isSelected || isHovered ? 1000 : 0,
      }).addTo(map)

      // Clique no marcador: centraliza mapa, seleciona e faz scroll suave até o card na lista lateral
      marker.on('click', () => {
        callbacksRef.current.onSelectPlace(place.id)

        // Centraliza visualização suavemente no mapa
        map.flyTo([place.latitude, place.longitude], Math.max(map.getZoom(), 15), {
          animate: true,
          duration: 0.6,
        })

        // Scroll suave até o card correspondente na lista lateral
        const cardElement = document.getElementById(`place-card-${place.id}`)
        if (cardElement) {
          cardElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      })

      // Hover nos marcadores
      marker.on('mouseover', () => {
        callbacksRef.current.onHoverPlace(place.id)
      })

      marker.on('mouseout', () => {
        callbacksRef.current.onHoverPlace(null)
      })

      markersMapRef.current.set(place.id, marker)
      bounds.extend([place.latitude, place.longitude])
    })

    // Ajusta o enquadramento do mapa se for a primeira carga ou troca de categoria
    if (bounds.isValid() && !selectedPlaceId) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [places, selectedPlaceId, hoveredPlaceId])

  // 3. Atualização visual reativa aos estados de Hover e Seleção (Interatividade Bidirecional)
  useEffect(() => {
    places.forEach((place) => {
      const marker = markersMapRef.current.get(place.id)
      if (!marker) return

      const isSelected = selectedPlaceId === place.id
      const isHovered = hoveredPlaceId === place.id

      // Atualiza o DivIcon com as classes de destaque
      const newIcon = createCustomDivIcon(place, isSelected, isHovered)
      marker.setIcon(newIcon)
      marker.setZIndexOffset(isSelected ? 2000 : isHovered ? 1000 : 0)
    })
  }, [hoveredPlaceId, selectedPlaceId, places])

  // Centraliza o mapa caso o card na lista lateral seja selecionado
  useEffect(() => {
    if (!selectedPlaceId || !mapInstanceRef.current) return
    const targetPlace = placesMapRef.current.get(selectedPlaceId)
    if (targetPlace) {
      mapInstanceRef.current.flyTo(
        [targetPlace.latitude, targetPlace.longitude],
        Math.max(mapInstanceRef.current.getZoom(), 15),
        { animate: true, duration: 0.6 }
      )
    }
  }, [selectedPlaceId])

  // Botão para resetar visualização / enquadrar todos os pontos
  const handleFitAll = () => {
    if (!mapInstanceRef.current || places.length === 0) return
    const bounds = L.latLngBounds(
      places.map((p) => [p.latitude, p.longitude] as [number, number])
    )
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
      })
    }
  }

  const selectedPlace = places.find((p) => p.id === selectedPlaceId)

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100">
      {/* Container Leaflet */}
      <div
        ref={mapContainerRef}
        className="w-full h-full z-10"
        aria-label="Mapa interativo de estabelecimentos"
      />

      {/* Botão de Enquadrar Todos os Locais */}
      <div className="absolute top-4 left-4 z-20">
        <button
          type="button"
          onClick={handleFitAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-900 font-semibold text-xs rounded-full shadow-md hover:shadow-lg border border-slate-200 transition-all cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Ver todos</span>
        </button>
      </div>

      {/* Mini Card Flutuante com prévia rápida do estabelecimento selecionado */}
      {selectedPlace && (
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200/90 flex gap-3 relative">
            <button
              type="button"
              onClick={() => onSelectPlace('')}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              aria-label="Fechar prévia"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={selectedPlace.cover_image_url}
              alt={selectedPlace.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />

            <div className="flex-1 min-w-0 pr-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                {selectedPlace.category}
              </span>
              <h4 className="font-bold text-sm text-slate-900 truncate">
                {selectedPlace.name}
              </h4>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {selectedPlace.address}
              </p>

              <div className="mt-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{selectedPlace.rating.toFixed(1)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const card = document.getElementById(
                      `place-card-${selectedPlace.id}`
                    )
                    card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                >
                  Ver na lista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
