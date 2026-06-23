'use client'

import { Fragment, useRef, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRecipe } from '@/context/RecipeContext'
import { MODAL_CLOSE_SEC } from '@/lib/config'

type Props = {
  onClose: () => void
}

export default function AddRecipeModal({ onClose }: Props) {
  const { uploadRecipe } = useRecipe()
  const { data: session } = useSession()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return
    const data = Object.fromEntries(new FormData(formRef.current)) as Record<
      string,
      string
    >
    setStatus('loading')
    try {
      await uploadRecipe(data)
      setStatus('success')
      setMessage('Recipe was uploaded successfully :)')
      setTimeout(onClose, MODAL_CLOSE_SEC)
    } catch (err) {
      setStatus('error')
      setMessage((err as Error).message)
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-all duration-500'
      />
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100rem] bg-white rounded-[9px] px-[6rem] py-[5rem] shadow-[0_4rem_6rem_rgba(0,0,0,0.25)] z-[1000] transition-all duration-500'>
        <button
          onClick={onClose}
          className='absolute top-[0.5rem] right-[1.6rem] text-[3.5rem] font-[inherit] text-inherit bg-transparent border-none cursor-pointer focus:outline-none'
        >
          &times;
        </button>

        {!session && (
          <div className='flex flex-col items-center gap-[2rem] px-[4rem] py-[5rem]'>
            <svg className='h-[4rem] w-[4rem] fill-[#f38e82]'>
              <use href='/icons.svg#icon-user' />
            </svg>
            <p className='text-[1.8rem] font-semibold text-center'>
              Please sign in to upload a recipe.
            </p>
            <button
              onClick={() => signIn('google')}
              className='flex items-center gap-[0.8rem] px-[3rem] py-[1.2rem] bg-gradient-to-br from-[#fbdb89] to-[#f48982] rounded-full text-white uppercase font-semibold text-[1.4rem] border-none cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none'
            >
              Sign in
            </button>
          </div>
        )}

        {session && status === 'loading' && (
          <div className='my-[5rem] mx-auto text-center'>
            <svg className='h-[6rem] w-[6rem] fill-[#f38e82] animate-spin-slow'>
              <use href='/icons.svg#icon-loader' />
            </svg>
          </div>
        )}

        {session && status === 'success' && (
          <div className='flex max-w-[40rem] mx-auto px-[4rem] py-[5rem]'>
            <svg className='h-[3rem] w-[3rem] fill-[#f38e82] -translate-y-[0.3rem]'>
              <use href='/icons.svg#icon-smile' />
            </svg>
            <p className='ml-[1.5rem] text-[1.8rem] leading-relaxed font-semibold'>
              {message}
            </p>
          </div>
        )}

        {session && status === 'error' && (
          <div className='flex max-w-[40rem] mx-auto px-[4rem] py-[5rem]'>
            <svg className='h-[3rem] w-[3rem] fill-[#f38e82] -translate-y-[0.3rem]'>
              <use href='/icons.svg#icon-alert-triangle' />
            </svg>
            <p className='ml-[1.5rem] text-[1.8rem] leading-relaxed font-semibold'>
              {message}
            </p>
          </div>
        )}

        {session && status === 'idle' && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className='grid grid-cols-2 gap-x-[6rem] gap-y-[4rem]'
          >
            <div className='grid grid-cols-[1fr_2.8fr] items-center gap-[1.5rem]'>
              <h3 className='col-span-full text-[2.25rem] font-bold uppercase mb-[1rem]'>
                Recipe data
              </h3>
              {[
                { label: 'Title', name: 'title', type: 'text' },
                { label: 'URL', name: 'sourceUrl', type: 'text' },
                { label: 'Image URL', name: 'image', type: 'text' },
                { label: 'Publisher', name: 'publisher', type: 'text' },
                { label: 'Prep time', name: 'cookingTime', type: 'number' },
                { label: 'Servings', name: 'servings', type: 'number' },
              ].map(field => (
                <Fragment key={field.name}>
                  <label className='text-[1.5rem] font-semibold'>
                    {field.label}
                  </label>
                  <input
                    required
                    name={field.name}
                    type={field.type}
                    className='text-[1.5rem] px-[1rem] py-[0.8rem] border border-[#ddd] rounded-[0.5rem] transition-all duration-200 focus:outline-none focus:border-[#f38e82] focus:bg-[#f9f5f3] placeholder:text-[#d3c7c3]'
                  />
                </Fragment>
              ))}
            </div>

            <div className='grid grid-cols-[1fr_2.8fr] items-center gap-[1.5rem]'>
              <h3 className='col-span-full text-[2.25rem] font-bold uppercase mb-[1rem]'>
                Ingredients
              </h3>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <Fragment key={n}>
                  <label className='text-[1.5rem] font-semibold'>
                    Ingredient {n}
                  </label>
                  <input
                    name={`ingredient-${n}`}
                    type='text'
                    placeholder="Format: 'Quantity,Unit,Description'"
                    className='text-[1.5rem] px-[1rem] py-[0.8rem] border border-[#ddd] rounded-[0.5rem] transition-all duration-200 focus:outline-none focus:border-[#f38e82] focus:bg-[#f9f5f3] placeholder:text-[#d3c7c3]'
                  />
                </Fragment>
              ))}
            </div>

            <button
              type='submit'
              className='col-span-full justify-self-center flex items-center gap-[1rem] px-[4rem] py-[1.5rem] bg-gradient-to-br from-[#fbdb89] to-[#f48982] rounded-full text-white uppercase font-semibold text-[1.5rem] border-none cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none'
            >
              <svg className='h-[2.25rem] w-[2.25rem] fill-white'>
                <use href='/icons.svg#icon-upload-cloud' />
              </svg>
              <span>Upload</span>
            </button>
          </form>
        )}
      </div>
    </>
  )
}
