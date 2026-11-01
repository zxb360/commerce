import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlaceCard } from '../components/PlacesList/PlaceCard'
import type { Establishment } from '../types/commerce'

const mockPlace: Establishment = {
  id: 'test-1',
  name: 'Café Teste Especial',
  category: 'Cafeteria',
  address: 'Rua das Flores, 100',
  rating: 4.9,
  reviewsCount: 150,
  cover_image_url: 'https://example.com/cover.jpg',
  logo_image_url: 'https://example.com/logo.jpg',
  latitude: -23.56,
  longitude: -46.68,
  isOpen: true,
  priceRange: '$$',
  tags: ['Wi-Fi', 'Pet Friendly'],
}

describe('PlaceCard component', () => {
  it('renders all essential establishment data', () => {
    render(<PlaceCard place={mockPlace} />)

    expect(screen.getByText('Café Teste Especial')).toBeInTheDocument()
    expect(screen.getByText('Cafeteria')).toBeInTheDocument()
    expect(screen.getByText('Rua das Flores, 100')).toBeInTheDocument()
    expect(screen.getByText('4.9')).toBeInTheDocument()
    expect(screen.getByText('Aberto agora')).toBeInTheDocument()

    const logoImg = screen.getByAltText('Logotipo de Café Teste Especial')
    expect(logoImg).toHaveAttribute('src', 'https://example.com/logo.jpg')

    const coverImg = screen.getByAltText('Fachada de Café Teste Especial')
    expect(coverImg).toHaveAttribute('src', 'https://example.com/cover.jpg')
  })

  it('triggers onMouseEnter, onMouseLeave, and onClick events', () => {
    const handleMouseEnter = vi.fn()
    const handleMouseLeave = vi.fn()
    const handleClick = vi.fn()

    render(
      <PlaceCard
        place={mockPlace}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    )

    const card = screen.getByRole('button', { name: /Café Teste Especial/i })

    fireEvent.mouseEnter(card)
    expect(handleMouseEnter).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(card)
    expect(handleMouseLeave).toHaveBeenCalledTimes(1)

    fireEvent.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('reflects selected state visually', () => {
    const { rerender } = render(
      <PlaceCard place={mockPlace} isSelected={false} />
    )
    const card = screen.getByRole('button', { name: /Café Teste Especial/i })
    expect(card).not.toHaveClass('border-blue-600')

    rerender(<PlaceCard place={mockPlace} isSelected={true} />)
    expect(card).toHaveClass('border-blue-600')
  })
})

