'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useRecipe } from '@/context/RecipeContext'
import Bookmarks from './Bookmarks'

type Props = {
  activeId: string
  onAddRecipeClick: () => void
}

export default function Header({ activeId, onAddRecipeClick }: Props) {
  const { loadSearchResults } = useRecipe()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const query = inputRef.current?.value.trim()
    if (!query) return
    if (inputRef.current) inputRef.current.value = ''
    await loadSearchResults(query)
  }

  return (
    <header
      className='flex items-center justify-between bg-grey-light-1'
      style={{ gridArea: 'head' }}
    >
      <Image
        src='/logo.png'
        alt='forkify logo'
        width={184}
        height={46}
        className='ml-16 h-[4.6rem] w-auto block'
        priority
      />

      <form
        onSubmit={handleSearch}
        className='flex items-center pl-12 bg-white rounded-full transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-[0_0.7rem_3rem_rgba(97,85,81,0.08)]'
      >
        <input
          ref={inputRef}
          type='text'
          className='border-none bg-transparent font-[inherit] text-inherit text-[1.4rem] w-md focus:outline-none placeholder:text-[#d3c7c3]'
          placeholder='Search over 1,000,000 recipes...'
        />
        <button
          type='submit'
          className='flex items-center gap-[0.8rem] px-[3rem] py-[1.8rem] bg-gradient-to-br from-[#fbdb89] to-[#f48982] rounded-full text-white uppercase font-semibold text-[1.3rem] border-none cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none'
        >
          <svg className='h-9 w-9 fill-white'>
            <use href='/icons.svg#icon-search' />
          </svg>
          <span>Search</span>
        </button>
      </form>

      <nav className='self-stretch mr-10'>
        <ul className='list-none flex h-full'>
          <li className='relative'>
            <button
              onClick={onAddRecipeClick}
              className='flex items-center h-full px-5 font-[inherit] text-inherit text-[1.2rem] font-bold uppercase bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-[#f2efee] focus:outline-none'
            >
              <svg className='h-[1.8rem] w-[1.8rem] fill-[#f38e82] mr-2'>
                <use href='/icons.svg#icon-edit' />
              </svg>
              <span>Add recipe</span>
            </button>
          </li>

          <li className='relative group'>
            <button className='flex items-center h-full px-[1.2rem] font-[inherit] text-inherit text-[1.2rem] font-bold uppercase bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-[#f2efee] focus:outline-none'>
              <svg className='h-[1.8rem] w-[1.8rem] fill-[#f38e82] mr-2'>
                <use href='/icons.svg#icon-bookmark' />
              </svg>
              <span>Bookmarks</span>
            </button>
            <div className='absolute right-[-2.5rem] z-10 w-[40rem] bg-white shadow-[0_0.8rem_5rem_2rem_rgba(97,85,81,0.1)] py-[1rem] invisible opacity-0 transition-all duration-500 group-hover:visible group-hover:opacity-100'>
              <Bookmarks activeId={activeId} />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  )
}
