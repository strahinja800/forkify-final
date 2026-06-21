'use client'

import { RecipePreview } from '@/context/RecipeContext'
import Image from 'next/image'

type Props = {
  recipe: RecipePreview
  activeId: string
}

export default function PreviewItem({ recipe, activeId }: Props) {
  const isActive = recipe.id === activeId

  return (
    <li className='preview'>
      <a
        href={`#${recipe.id}`}
        className={`flex items-center px-[3.25rem] py-[1.5rem] transition-all duration-300 border-r border-white no-underline hover:-translate-y-0.5 hover:bg-[#f9f5f3] ${
          isActive ? 'bg-[#f9f5f3]' : ''
        }`}
      >
        <figure className="relative flex-[0_0_5.8rem] rounded-full overflow-hidden h-[5.8rem] mr-[2rem] [backface-visibility:hidden] before:content-[''] before:block before:h-full before:w-full before:absolute before:top-0 before:left-0 before:bg-gradient-to-br before:from-[#fbdb89] before:to-[#f48982] before:opacity-40">
          {recipe.image.startsWith('http') || recipe.image.startsWith('/') ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className='object-cover'
              sizes='5.8rem'
            />
          ) : (
            <div className='absolute inset-0 bg-gradient-to-br from-[#fbdb89] to-[#f48982]' />
          )}
        </figure>
        <div className='grid w-full grid-cols-[1fr_2rem] gap-y-[0.1rem] items-center'>
          <h4 className='col-span-full text-[1.45rem] text-[#f38e82] uppercase font-semibold overflow-hidden text-ellipsis whitespace-nowrap max-w-[25rem]'>
            {recipe.title}
          </h4>
          <p className='text-[1.15rem] text-[#918581] uppercase font-semibold'>
            {recipe.publisher}
          </p>
          {recipe.key && (
            <div className='flex items-center justify-center h-[2rem] w-[2rem] rounded-full bg-[#ece9e8] ml-auto mr-[1.75rem]'>
              <svg className='h-[1.2rem] w-[1.2rem] fill-[#f38e82]'>
                <use href='/icons.svg#icon-user' />
              </svg>
            </div>
          )}
        </div>
      </a>
    </li>
  )
}
