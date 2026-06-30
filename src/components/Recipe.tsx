'use client'

import Image from 'next/image'
import { Fraction } from 'fraction.js'
import { useRecipe } from '@/context/RecipeContext'

export default function Recipe() {
  const { state, updateServings, addBookmark, removeBookmark } = useRecipe()
  const { recipe, loading, error } = state

  if (loading) {
    return (
      <div
        className='bg-[#f9f5f3]'
        style={{ gridArea: 'recipe' }}
      >
        <div className='my-[5rem] mx-auto text-center'>
          <svg className='h-[6rem] w-[6rem] fill-[#f38e82] animate-spin-slow'>
            <use href='/icons.svg#icon-loader' />
          </svg>
        </div>
      </div>
    )
  }

  if (error) {
    const currentId = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
    const isBookmarked = state.bookmarks.some(b => b.id === currentId)
    const is400 = error?.includes('400')

    return (
      <div
        className='bg-[#f9f5f3]'
        style={{ gridArea: 'recipe' }}
      >
        <div className='flex flex-col max-w-[40rem] mx-auto px-[4rem] py-[5rem] gap-[2rem]'>
          <div className='flex'>
            <svg className='h-[3rem] w-[3rem] fill-[#f38e82] shrink-0 -translate-y-[0.3rem]'>
              <use href='/icons.svg#icon-alert-triangle' />
            </svg>
            <p className='ml-[1.5rem] text-[1.8rem] leading-relaxed font-semibold'>
              {is400
                ? 'This recipe no longer exists.'
                : error}
            </p>
          </div>
          {is400 && isBookmarked && (
            <button
              onClick={() => {
                removeBookmark(currentId)
                window.location.hash = ''
              }}
              className='self-start flex items-center gap-[0.8rem] px-[2rem] py-[1rem] bg-gradient-to-br from-[#fbdb89] to-[#f48982] rounded-full text-white text-[1.3rem] font-semibold uppercase border-none cursor-pointer hover:scale-105 transition-all duration-200'
            >
              <svg className='h-[1.8rem] w-[1.8rem] fill-white'>
                <use href='/icons.svg#icon-bookmark' />
              </svg>
              Remove from bookmarks
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div
        className='bg-[#f9f5f3]'
        style={{ gridArea: 'recipe' }}
      >
        <div className='flex items-start gap-[1.5rem] px-[4rem] py-[5rem]'>
          <svg className='h-[2.4rem] w-[2.4rem] fill-[#f38e82] shrink-0 mt-[0.2rem]'>
            <use href='/icons.svg#icon-smile' />
          </svg>
          <p className='text-[1.4rem] text-[#918581] font-semibold leading-snug'>
            Start by searching for a recipe or an ingredient. Have fun!
          </p>
        </div>
      </div>
    )
  }

  function handleBookmark() {
    if (!recipe) return
    if (recipe.bookmarked) removeBookmark(recipe.id)
    else addBookmark(recipe)
  }

  return (
    <div
      className='bg-[#f9f5f3]'
      style={{ gridArea: 'recipe' }}
    >
      {/* Figure */}
      <figure className='relative h-[32rem] [transform-origin:top]'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#fbdb89] to-[#f48982] opacity-60 z-10' />
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className='object-cover'
          sizes='(max-width: 980px) 100vw, 66vw'
        />
        <h1 className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[20%] -skew-y-6 text-white font-bold text-[3.25rem] uppercase w-1/2 leading-[1.95] text-center z-20'>
          <span className='recipe-title-span'>{recipe.title}</span>
        </h1>
      </figure>

      {/* Details */}
      <div className='flex items-center px-[8rem] pt-[7.5rem] pb-[3.5rem]'>
        <div className='flex items-center text-[1.65rem] uppercase mr-[4.5rem]'>
          <svg className='h-[2.35rem] w-[2.35rem] fill-[#f38e82] mr-[1.15rem]'>
            <use href='/icons.svg#icon-clock' />
          </svg>
          <span className='mr-[0.5rem] font-bold'>{recipe.cookingTime}</span>
          <span>minutes</span>
        </div>

        <div className='flex items-center text-[1.65rem] uppercase'>
          <svg className='h-[2.35rem] w-[2.35rem] fill-[#f38e82] mr-[1.15rem]'>
            <use href='/icons.svg#icon-users' />
          </svg>
          <span className='mr-[0.5rem] font-bold'>{recipe.servings}</span>
          <span>servings</span>
          <div className='flex ml-[1.6rem] -translate-y-[1px]'>
            <button
              onClick={() =>
                recipe.servings > 1 && updateServings(recipe.servings - 1)
              }
              className='h-[2rem] w-[2rem] border-none bg-transparent cursor-pointer mr-[0.3rem] focus:outline-none hover:[&_svg]:-translate-y-[1px] hover:[&_svg]:fill-[#f48982]'
            >
              <svg className='h-full w-full fill-[#f38e82] transition-all duration-300'>
                <use href='/icons.svg#icon-minus-circle' />
              </svg>
            </button>
            <button
              onClick={() => updateServings(recipe.servings + 1)}
              className='h-[2rem] w-[2rem] border-none bg-transparent cursor-pointer focus:outline-none hover:[&_svg]:-translate-y-[1px] hover:[&_svg]:fill-[#f48982]'
            >
              <svg className='h-full w-full fill-[#f38e82] transition-all duration-300'>
                <use href='/icons.svg#icon-plus-circle' />
              </svg>
            </button>
          </div>
        </div>

        {recipe.key && (
          <div className='flex items-center justify-center h-[4rem] w-[4rem] rounded-full bg-[#ece9e8] ml-auto mr-[1.75rem]'>
            <svg className='h-[2.25rem] w-[2.25rem] fill-[#f38e82]'>
              <use href='/icons.svg#icon-user' />
            </svg>
          </div>
        )}

        <button
          onClick={handleBookmark}
          className={`flex items-center justify-center h-[4.5rem] w-[4.5rem] rounded-full bg-gradient-to-br from-[#fbdb89] to-[#f48982] border-none cursor-pointer transition-all duration-200 hover:scale-[1.07] focus:outline-none ${!recipe.key ? 'ml-auto' : ''}`}
        >
          <svg className='h-[2.5rem] w-[2.5rem] fill-white'>
            <use
              href={`/icons.svg#icon-bookmark${recipe.bookmarked ? '-fill' : ''}`}
            />
          </svg>
        </button>
      </div>

      {/* Ingredients */}
      <div className='flex flex-col items-center px-[8rem] py-[5rem] text-[1.6rem] leading-[1.4] bg-[#f2efee]'>
        <h2 className='text-[2rem] font-bold text-[#f38e82] uppercase mb-[2.5rem] text-center'>
          Recipe ingredients
        </h2>
        <ul className='grid grid-cols-2 gap-x-[3rem] gap-y-[2.5rem] list-none'>
          {recipe.ingredients.map((ing, i) => (
            <li
              key={i}
              className='flex'
            >
              <svg className='h-[2rem] w-[2rem] fill-[#f38e82] mr-[1.1rem] flex-[0_0_auto] mt-[0.1rem]'>
                <use href='/icons.svg#icon-check' />
              </svg>
              <div>
                <span className='mr-[0.5rem] flex-[0_0_auto]'>
                  {ing.quantity
                    ? new Fraction(ing.quantity).toFraction(true)
                    : ''}
                </span>
                <span className='font-semibold mr-[0.3rem]'>{ing.unit}</span>
                {ing.description}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Directions */}
      <div className='flex flex-col items-center px-[10rem] py-[5rem]'>
        <h2 className='text-[2rem] font-bold text-[#f38e82] uppercase mb-[2.5rem] text-center'>
          How to cook it
        </h2>
        <p className='text-[1.7rem] text-center mb-[3.5rem] text-[#918581]'>
          This recipe was carefully designed and tested by{' '}
          <span className='font-bold'>{recipe.publisher}</span>. Please check
          out directions at their website.
        </p>
        <a
          href={recipe.sourceUrl}
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-[1rem] px-[2.25rem] py-[1.25rem] bg-gradient-to-br from-[#fbdb89] to-[#f48982] rounded-full text-white uppercase font-semibold text-[1.4rem] no-underline transition-all duration-200 hover:scale-105 focus:outline-none'
        >
          <span>Directions</span>
          <svg className='h-[1.75rem] w-[1.75rem] fill-white'>
            <use href='/icons.svg#icon-arrow-right' />
          </svg>
        </a>
      </div>
    </div>
  )
}
