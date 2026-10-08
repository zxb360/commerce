import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ViewToggleButton } from '../components/MobileToggle/ViewToggleButton'

describe('ViewToggleButton component', () => {
  it('renders "Ver Mapa" when in list mode', () => {
    const handleToggle = vi.fn()
    render(<ViewToggleButton viewMode="list" onToggle={handleToggle} />)

    expect(screen.getByText('Ver Mapa')).toBeInTheDocument()
    const button = screen.getByRole('button', {
      name: /Alternar para visualização de mapa/i,
    })
    fireEvent.click(button)
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it('renders "Ver Lista" when in map mode', () => {
    const handleToggle = vi.fn()
    render(<ViewToggleButton viewMode="map" onToggle={handleToggle} />)

    expect(screen.getByText('Ver Lista')).toBeInTheDocument()
    const button = screen.getByRole('button', {
      name: /Alternar para visualização de lista/i,
    })
    fireEvent.click(button)
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })
})
