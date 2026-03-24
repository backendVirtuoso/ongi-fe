'use client'

import { memo } from 'react'
import type { Category } from '@/types'
import { CATEGORY_LABELS } from '@/types'

const CATEGORIES: Category[] = ['COMFORT', 'CHEER', 'ENCOURAGE', 'SUPPORT', 'CELEBRATE', 'LOVE']

interface CategoryFilterProps {
  selected: Category
  onChange: (category: Category) => void
}

// rerender-memo: props가 바뀌지 않으면 리렌더 스킵
function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150
            ${
              selected === cat
                ? 'bg-orange-400 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }
          `}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  )
}

export default memo(CategoryFilter)
