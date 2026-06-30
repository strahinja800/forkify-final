'use client'

import { useEffect, useState } from 'react'
import { useRecipe } from '@/context/RecipeContext'
import Header from '@/components/Header'
import SearchResults from '@/components/SearchResults'
import Recipe from '@/components/Recipe'
import AddRecipeModal from '@/components/AddRecipeModal'
import AuthModal from '@/components/AuthModal'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer'

export default function Home() {
  const { loadRecipe, loadSearchResults } = useRecipe()
  const [activeId, setActiveId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    function handleHash() {
      const id = window.location.hash.slice(1)
      if (id) {
        setActiveId(id)
        loadRecipe(id)
        setDrawerOpen(false)
      }
    }

    if (!window.location.hash) {
      loadSearchResults('chicken')
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [loadRecipe, loadSearchResults])

  return (
    <div className='forkify-container'>
      <Header
        activeId={activeId}
        onAddRecipeClick={() => setShowModal(true)}
        onAuthClick={() => setShowAuth(true)}
        onOpenSearch={() => setDrawerOpen(true)}
      />

      {/* Desktop sidebar — hidden on mobile */}
      <div className='hidden md:block' style={{ gridArea: 'list', overflow: 'auto' }}>
        <SearchResults activeId={activeId} />
      </div>

      {/* Mobile drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction='left'>
        <DrawerContent className='w-[85vw] max-w-[40rem] bg-white p-0 overflow-y-auto'>
          <DrawerTitle className='sr-only'>Search Results</DrawerTitle>
          <SearchResults activeId={activeId} />
        </DrawerContent>
      </Drawer>

      <Recipe />

      {showModal && (
        <AddRecipeModal
          onClose={() => setShowModal(false)}
          onSignInClick={() => {
            setShowModal(false)
            setShowAuth(true)
          }}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
