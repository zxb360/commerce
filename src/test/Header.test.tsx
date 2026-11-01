import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../components/Header/Header'

describe('Header component', () => {
  it('renders logo brand name and search input', () => {
    const handleSearchChange = vi.fn()
    render(
      <Header
        searchQuery=""
        onSearchChange={handleSearchChange}
        totalCount={8}
      />
    )

    expect(screen.getByText('SpotCommerce')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByText('Marina Silva')).toBeInTheDocument()
  })

  it('calls onSearchChange when user types in search box', () => {
    const handleSearchChange = vi.fn()
    render(
      <Header
        searchQuery=""
        onSearchChange={handleSearchChange}
        totalCount={8}
      />
    )

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'Café' } })

    expect(handleSearchChange).toHaveBeenCalledWith('Café')
  })

  it('shows clear button and clears search when clicked', () => {
    const handleSearchChange = vi.fn()
    render(
      <Header
        searchQuery="Padaria"
        onSearchChange={handleSearchChange}
        totalCount={2}
      />
    )

    const clearBtn = screen.getByLabelText('Limpar busca')
    expect(clearBtn).toBeInTheDocument()
    fireEvent.click(clearBtn)

    expect(handleSearchChange).toHaveBeenCalledWith('')
  })
})

