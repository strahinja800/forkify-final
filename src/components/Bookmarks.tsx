'use client';

import { useRecipe } from '@/context/RecipeContext';
import PreviewItem from './PreviewItem';

type Props = {
  activeId: string;
};

export default function Bookmarks({ activeId }: Props) {
  const { state } = useRecipe();

  return (
    <div className="bookmarks absolute right-[-2.5rem] z-10 w-[40rem] bg-white shadow-[0_0.8rem_5rem_2rem_rgba(97,85,81,0.1)] invisible opacity-0 transition-all duration-500 delay-200 py-[1rem]">
      <ul className="list-none">
        {state.bookmarks.length === 0 ? (
          <div className="flex max-w-[40rem] mx-auto px-[4rem] py-[5rem]">
            <svg className="h-[3rem] w-[3rem] fill-[#f38e82] -translate-y-[0.3rem]">
              <use href="/icons.svg#icon-smile" />
            </svg>
            <p className="ml-[1.5rem] text-[1.8rem] leading-relaxed font-semibold">
              No bookmarks yet. Find a nice recipe and bookmark it :)
            </p>
          </div>
        ) : (
          state.bookmarks.map(bookmark => (
            <PreviewItem key={bookmark.id} recipe={bookmark} activeId={activeId} />
          ))
        )}
      </ul>
    </div>
  );
}
