import React from 'react'
import { Map as MapIcon, List as ListIcon } from 'lucide-react'
import type { ViewMode } from '../../types/commerce'

interface ViewToggleButtonProps {
  viewMode: ViewMode
  onToggle: () => void
}

export const ViewToggleButton: React.FC<ViewToggleButtonProps> = ({
  viewMode,
  onToggle,
}) => {
  const isMap = viewMode === 'map'

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <button
        type="button"
        onClick={onToggle}
        aria-label={isMap ? 'Alternar para visualização de lista' : 'Alternar para visualização de mapa'}
        className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-full shadow-2xl shadow-slate-900/40 border border-slate-700 active:scale-95 transition-all cursor-pointer"
      >
        {isMap ? (
          <>
            <ListIcon className="w-4 h-4 text-blue-400" />
            <span>Ver Lista</span>
          </>
        ) : (
          <>
            <MapIcon className="w-4 h-4 text-emerald-400" />
            <span>Ver Mapa</span>
          </>
        )}
      </button>
    </div>
  )
}
