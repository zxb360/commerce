import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlacesList } from '../components/PlacesList/PlacesList'
import type { Establishment } from '../types/commerce'

const mockPlaces: Establishment[] = [
  {
    id: 'test-1',
    name: 'Café Alfa',
    category: 'Cafeteria',
    address: 'Rua Alfa, 10',
    rating: 4.8,
    reviewsCount: 100,
    cover_image_url: 'https://example.com/alfa.jpg',
    logo_image_url: 'https://example.com/logo-alfa.jpg',
    latitude: -23.56,
    longitude: -46.68,
    isOpen: true,
  },
  {
    id: 'test-2',
    name: 'Pizzaria Beta',
    category: 'Restaurante',
    address: 'Rua Beta, 20',
    rating: 4.5,
    reviewsCount: 80,
    cover_image_url: 'https://example.com/beta.jpg',
    logo_image_url: 'https://example.com/logo-beta.jpg',
    latitude: -23.57,
    longitude: -46.69,
    isOpen: false,
  },
]

describe('PlacesList component', () => {
  it('renders all places cards and count badge', () => {
    const handleSelectCategory = vi.fn()
    const handleHoverPlace = vi.fn()
    const handleSelectPlace = vi.fn()

    render(
      <PlacesList
        places={mockPlaces}
        allCategories={['Cafeteria', 'Restaurante']}
        selectedCategory="all"
        onSelectCategory={handleSelectCategory}
        hoveredPlaceId={null}
        selectedPlaceId={null}
        onHoverPlace={handleHoverPlace}
        onSelectPlace={handleSelectPlace}
      />
    )

    expect(screen.getByText('Café Alfa')).toBeInTheDocument()
    expect(screen.getByText('Pizzaria Beta')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('filters by open now toggle', () => {
    render(
      <PlacesList
        places={mockPlaces}
        allCategories={['Cafeteria', 'Restaurante']}
        selectedCategory="all"
        onSelectCategory={vi.fn()}
        hoveredPlaceId={null}
        selectedPlaceId={null}
        onHoverPlace={vi.fn()}
        onSelectPlace={vi.fn()}
      />
    )

    const checkbox = screen.getByRole('checkbox', { name: /Abertos agora/i })
    fireEvent.click(checkbox)

    // Apenas o Café Alfa está aberto
    expect(screen.getByText('Café Alfa')).toBeInTheDocument()
    expect(screen.queryByText('Pizzaria Beta')).not.toBeInTheDocument()
  })

  it('shows empty state when list is empty', () => {
    const handleClearFilters = vi.fn()

    render(
      <PlacesList
        places={[]}
        allCategories={['Cafeteria', 'Restaurante']}
        selectedCategory="Cafeteria"
        onSelectCategory={vi.fn()}
        hoveredPlaceId={null}
        selectedPlaceId={null}
        onHoverPlace={vi.fn()}
        onSelectPlace={vi.fn()}
        onClearFilters={handleClearFilters}
      />
    )

    expect(screen.getByText('Nenhum comércio encontrado')).toBeInTheDocument()
    const clearBtn = screen.getByRole('button', { name: /Limpar filtros/i })
    fireEvent.click(clearBtn)
    expect(handleClearFilters).toHaveBeenCalledTimes(1)
  })
})
