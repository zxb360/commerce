import React from 'react'
import type { Establishment } from '../../types/commerce'
import { RatingBadge } from '../common/RatingBadge'
import { MapPin, Clock, Phone } from 'lucide-react'

interface PlaceCardProps {
  place: Establishment
  isSelected?: boolean
  isHovered?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isSelected = false,
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <article
      id={`place-card-${place.id}`}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Estabelecimento: ${place.name}, categoria ${place.category}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 outline-hidden cursor-pointer overflow-hidden text-left ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-lg -translate-y-1 bg-blue-50/10'
          : isHovered
            ? 'border-blue-400 ring-2 ring-blue-400/20 shadow-md -translate-y-0.5'
            : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Imagem Principal com proporção consistente (aspect-video) */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
        <img
          src={place.cover_image_url}
          alt={`Fachada de ${place.name}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradiente sutil para legibilidade de badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Badge de Status Aberto / Fechado e Faixa de Preço */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${
              place.isOpen
                ? 'bg-emerald-500/90 text-white'
                : 'bg-slate-900/80 text-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            {place.isOpen ? 'Aberto agora' : 'Fechado'}
          </span>

          {place.priceRange && (
            <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
              {place.priceRange}
            </span>
          )}
        </div>

        {/* Avaliação sobreposta no canto superior direito */}
        <div className="absolute top-3 right-3">
          <RatingBadge rating={place.rating} size="sm" />
        </div>

        {/* Miniatura circular do logotipo sobreposta entre a imagem e as informações */}
        <div className="absolute -bottom-4 left-4 z-10">
          <div className="relative">
            <img
              src={place.logo_image_url}
              alt={`Logotipo de ${place.name}`}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md bg-white ring-1 ring-slate-100"
            />
            {place.isOpen && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-4 pt-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Categoria e Avaliação Completa */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {place.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {place.reviewsCount} avaliações
            </span>
          </div>

          {/* Título do Comércio */}
          <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
            {place.name}
          </h3>

          {/* Endereço resumido */}
          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{place.address}</span>
          </p>

          {/* Telefone (se houver) */}
          {place.phone && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{place.phone}</span>
            </p>
          )}
        </div>

        {/* Tags rápidas no rodapé do card */}
        {place.tags && place.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
            {place.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
            {place.tags.length > 2 && (
              <span className="text-[10px] font-medium text-slate-400 self-center">
                +{place.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
