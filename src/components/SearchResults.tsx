'use client';

import { useRecipe } from '@/context/RecipeContext';
import PreviewItem from './PreviewItem';

type Props = {
  activeId: string;
};

export default function SearchResults({ activeId }: Props) {
  const { state, getSearchResultsPage, setPage } = useRecipe();
  const { search, searchLoading } = state;

  const numPages = Math.ceil(search.results.length / search.resultsPerPage);
  const currentPage = search.page;
  const results = getSearchResultsPage(currentPage);

  if (searchLoading) {
    return (
      <div className="pt-[3rem] pb-0 flex flex-col" style={{ gridArea: 'list' }}>
        <div className="my-[5rem] mx-auto text-center">
          <svg className="h-[6rem] w-[6rem] fill-[#f38e82] animate-spin-slow">
            <use href="/icons.svg#icon-loader" />
          </svg>
        </div>
      </div>
    );
  }

  if (state.error && search.query && search.results.length === 0) {
    return (
      <div className="pt-[3rem] flex flex-col" style={{ gridArea: 'list' }}>
        <div className="flex max-w-[40rem] mx-auto px-[4rem] py-[5rem]">
          <svg className="h-[3rem] w-[3rem] fill-[#f38e82] -translate-y-[0.3rem]">
            <use href="/icons.svg#icon-alert-triangle" />
          </svg>
          <p className="ml-[1.5rem] text-[1.8rem] leading-relaxed font-semibold">
            Something went wrong. Please try again!
          </p>
        </div>
      </div>
    );
  }

  if (search.results.length === 0 && search.query) {
    return (
      <div className="pt-[3rem] flex flex-col" style={{ gridArea: 'list' }}>
        <div className="flex max-w-[40rem] mx-auto px-[4rem] py-[5rem]">
          <svg className="h-[3rem] w-[3rem] fill-[#f38e82] -translate-y-[0.3rem]">
            <use href="/icons.svg#icon-alert-triangle" />
          </svg>
          <p className="ml-[1.5rem] text-[1.8rem] leading-relaxed font-semibold">
            We could not find anything under that name. Please try again!
          </p>
        </div>
      </div>
    );
  }

  if (search.results.length === 0) {
    return (
      <div className="flex flex-col h-full" style={{ gridArea: 'list' }}>
        <div className="flex items-start gap-[1.5rem] px-[4rem] py-[5rem]">
          <svg className="h-[2.4rem] w-[2.4rem] fill-[#f38e82] shrink-0 mt-[0.2rem]">
            <use href="/icons.svg#icon-smile" />
          </svg>
          <p className="text-[1.4rem] text-[#918581] font-semibold leading-snug">
            Search over 1,000,000 recipes above. Have fun!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-[3rem] flex flex-col h-full" style={{ gridArea: 'list' }}>
      <ul className="list-none mb-[2rem]">
        {results.map(recipe => (
          <PreviewItem key={recipe.id} recipe={recipe} activeId={activeId} />
        ))}
      </ul>

      {numPages > 1 && (
        <div className="mt-auto px-[3.5rem] relative after:content-[''] after:block after:clear-both">
          {currentPage > 1 && (
            <button
              onClick={() => setPage(currentPage - 1)}
              className="float-left flex items-center gap-[0.2rem] px-[1.2rem] py-[0.8rem] text-[#f38e82] text-[1.3rem] font-semibold bg-[#f9f5f3] rounded-full border-none cursor-pointer transition-all duration-200 hover:text-[#f48982] hover:bg-[#f2efee] focus:outline-none"
            >
              <svg className="h-[1.6rem] w-[1.6rem] fill-current">
                <use href="/icons.svg#icon-arrow-left" />
              </svg>
              <span>Page {currentPage - 1}</span>
            </button>
          )}

          <span className="absolute top-[-12%] left-[40%] text-[#f38e82] text-[1.4rem] text-center mt-[1rem]">
            Page {currentPage} of {numPages}
          </span>

          {currentPage < numPages && (
            <button
              onClick={() => setPage(currentPage + 1)}
              className="float-right flex items-center gap-[0.2rem] px-[1.2rem] py-[0.8rem] text-[#f38e82] text-[1.3rem] font-semibold bg-[#f9f5f3] rounded-full border-none cursor-pointer transition-all duration-200 hover:text-[#f48982] hover:bg-[#f2efee] focus:outline-none"
            >
              <span>Page {currentPage + 1}</span>
              <svg className="h-[1.6rem] w-[1.6rem] fill-current">
                <use href="/icons.svg#icon-arrow-right" />
              </svg>
            </button>
          )}
        </div>
      )}

      <p className="text-[#918581] text-[1.2rem] px-[3.5rem] mt-auto pt-[4rem]">
        &copy; Copyright by{' '}
        <a
          className="text-[#918581]"
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/jonasschmedtman"
        >
          Jonas Schmedtmann
        </a>
        . Use for learning or your portfolio. Don&apos;t use to teach. Don&apos;t claim as your own.
      </p>
    </div>
  );
}
