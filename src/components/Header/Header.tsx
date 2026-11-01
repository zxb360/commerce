import React from 'react'
import {
  Search,
  SlidersHorizontal,
  Bell,
  Heart,
  MapPin,
  X,
} from 'lucide-react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount?: number
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 h-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo / Marca */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                SpotCommerce
              </span>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                SP
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Explore comércios locais
            </p>
          </div>
        </div>

        {/* Barra de busca fictícia moderna com atalho e limpeza */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              role="searchbox"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar comércios, cafés, padarias ou categorias..."
              className="w-full h-11 pl-10 pr-20 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-full border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
            <div className="absolute right-3 flex items-center gap-1">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Limpar busca"
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>
        </div>

        {/* Ações e Avatar do usuário */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            aria-label="Filtros rápidos"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-full transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtros</span>
            {totalCount !== undefined && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-white text-slate-600 rounded-full text-[10px] font-bold border border-slate-200">
                {totalCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Favoritos"
            className="p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
          >
            <Heart className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Notificações"
            className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Avatar com status online */}
          <div className="flex items-center gap-2 pl-1 cursor-pointer group">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Avatar da usuária Marina Silva"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-blue-500 transition-all shadow-2xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                Marina Silva
              </div>
              <div className="text-[11px] text-slate-400">São Paulo, SP</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

