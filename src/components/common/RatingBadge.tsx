import React from 'react'
import { Star } from 'lucide-react'

interface RatingBadgeProps {
  rating: number
  reviewsCount?: number
  size?: 'sm' | 'md'
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  reviewsCount,
  size = 'md',
}) => {
  const isSm = size === 'sm'

  return (
    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 rounded-full px-2 py-0.5 text-amber-900 font-semibold shadow-xs">
      <Star
        className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill-amber-400 text-amber-500`}
      />
      <span className={`${isSm ? 'text-xs' : 'text-sm'} leading-none`}>
        {rating.toFixed(1)}
      </span>
      {reviewsCount !== undefined && (
        <span className="text-xs text-amber-700/80 font-normal">
          ({reviewsCount})
        </span>
      )}
    </div>
  )
}

