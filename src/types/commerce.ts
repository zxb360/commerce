export interface Establishment {
  id: string
  name: string
  category: string
  address: string
  rating: number
  reviewsCount: number
  cover_image_url: string
  logo_image_url: string
  latitude: number
  longitude: number
  isOpen: boolean
  priceRange?: '$' | '$$' | '$$$' | '$$$$'
  phone?: string
  tags?: string[]
}

export type ViewMode = 'list' | 'map'
