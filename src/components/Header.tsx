'use client'

import { useRef, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRecipe } from '@/context/RecipeContext'
import Bookmarks from './Bookmarks'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  activeId: string
  onAddRecipeClick: () => void
  onAuthClick: () => void
}

export default function Header({
  activeId,
  onAddRecipeClick,
  onAuthClick,
}: Props) {
  const { loadSearchResults } = useRecipe()
  const { data: session } = useSession()
  const inputRef = useRef<HTMLInputElement>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

  async function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const query = inputRef.current?.value.trim()
    if (!query) return
    if (inputRef.current) inputRef.current.value = ''
    await loadSearchResults(query)
  }

  return (
    <>
      <header
        className='flex items-center justify-between bg-grey-light-1'
        style={{ gridArea: 'head' }}
      >
        <Link href='/'>
          <Image
            src='/logo.png'
            alt='forkify logo'
            width={184}
            height={46}
            className='ml-16 h-[4.6rem] w-auto block'
            priority
          />
        </Link>

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
          <ul className='list-none flex h-full items-center'>
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
              <div className='absolute right-[-2.5rem] z-50 w-[40rem] bg-white shadow-[0_0.8rem_5rem_2rem_rgba(97,85,81,0.1)] py-[1rem] invisible opacity-0 transition-all duration-500 group-hover:visible group-hover:opacity-100'>
                <Bookmarks activeId={activeId} />
              </div>
            </li>

            <li className='ml-2 relative'>
              {session ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(v => !v)}
                    className='flex items-center h-full gap-[0.6rem] px-[1.2rem] font-[inherit] text-inherit text-[1.2rem] font-bold uppercase bg-transparent border-none cursor-pointer transition-all duration-300 hover:bg-[#f2efee] focus:outline-none'
                  >
                    <svg className='h-[1.6rem] w-[1.6rem] fill-[#f38e82]'>
                      <use href='/icons.svg#icon-user' />
                    </svg>
                    <span>{session.user?.name ?? session.user?.email}</span>
                    <svg
                      className={`h-[1.2rem] w-[1.2rem] fill-[#918581] transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                    >
                      <use href='/icons.svg#icon-triangle' />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className='fixed inset-0 z-[50]'
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className='absolute right-0 top-[calc(100%+0.4rem)] z-[60] bg-white rounded-[9px] shadow-[0_0.8rem_3rem_rgba(97,85,81,0.15)] py-[0.6rem] min-w-[14rem] overflow-hidden'>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            setShowSignOutConfirm(true)
                          }}
                          className='w-full flex items-center gap-[0.8rem] px-[1.6rem] py-[1rem] text-[1.3rem] font-semibold text-[#615551] bg-transparent border-none cursor-pointer text-left hover:bg-[#f9f5f3] transition-colors duration-150 focus:outline-none'
                        >
                          <svg className='h-[1.6rem] w-[1.6rem] fill-[#f38e82]'>
                            <use href='/icons.svg#icon-logout' />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </>
                  )}

                  {showSignOutConfirm && (
                    <>
                      <div
                        onClick={() => setShowSignOutConfirm(false)}
                        className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]'
                      />
                      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white rounded-[9px] px-[3.5rem] py-[3.5rem] shadow-[0_4rem_6rem_rgba(0,0,0,0.25)] w-[38rem] text-center'>
                        <svg className='h-[4rem] w-[4rem] fill-[#f38e82] mx-auto mb-[1.5rem]'>
                          <use href='/icons.svg#icon-logout' />
                        </svg>
                        <p className='text-[1.8rem] font-semibold text-[#615551] mb-[0.6rem]'>
                          Sign out?
                        </p>
                        <p className='text-[1.4rem] text-[#918581] mb-[3rem]'>
                          Are you sure you want to sign out?
                        </p>
                        <div className='flex gap-[1.2rem] justify-center'>
                          <button
                            onClick={() => setShowSignOutConfirm(false)}
                            className='px-[2.5rem] py-[1rem] text-[1.3rem] font-bold uppercase text-[#918581] bg-[#f2efee] rounded-full border-none cursor-pointer hover:bg-[#e8e3e0] transition-colors duration-200 focus:outline-none'
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => signOut()}
                            className='px-[2.5rem] py-[1rem] text-[1.3rem] font-bold uppercase text-white bg-gradient-to-br from-[#fbdb89] to-[#f48982] rounded-full border-none cursor-pointer hover:scale-105 transition-all duration-200 focus:outline-none'
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={onAuthClick}
                  className='flex items-center gap-[0.8rem] px-[2rem] py-[1rem] bg-gradient-to-br from-[#fbdb89] to-[#f48982] rounded-full text-white uppercase font-semibold text-[1.2rem] border-none cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none'
                >
                  <svg className='h-[1.6rem] w-[1.6rem] fill-white'>
                    <use href='/icons.svg#icon-user' />
                  </svg>
                  <span>Sign in</span>
                </button>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
