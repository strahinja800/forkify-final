'use client'

import { useRecipe } from '@/context/RecipeContext'
import PreviewItem from './PreviewItem'

type Props = {
  activeId: string
}

export default function Bookmarks({ activeId }: Props) {
  const { state } = useRecipe()

  return (
    <div>
      <ul className='list-none'>
        {state.bookmarks.length === 0 ? (
          <div className='flex max-w-[40rem] mx-auto px-[4rem] py-[5rem]'>
            <svg className='h-[3rem] w-[3rem] fill-[#f38e82] -translate-y-[0.3rem]'>
              <use href='/icons.svg#icon-smile' />
            </svg>
            <p className='ml-[1.5rem] text-[1.8rem] leading-relaxed font-semibold'>
              No bookmarks yet. Find a nice recipe and bookmark it :)
            </p>
          </div>
        ) : (
          state.bookmarks.map(bookmark => (
            <PreviewItem
              key={bookmark.id}
              recipe={bookmark}
              activeId={activeId}
            />
          ))
        )}
      </ul>
    </div>
  )
}
