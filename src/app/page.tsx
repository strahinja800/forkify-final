'use client';

import { useEffect, useState } from 'react';
import { useRecipe } from '@/context/RecipeContext';
import Header from '@/components/Header';
import SearchResults from '@/components/SearchResults';
import Recipe from '@/components/Recipe';
import AddRecipeModal from '@/components/AddRecipeModal';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const { loadRecipe } = useRecipe();
  const [activeId, setActiveId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    function handleHash() {
      const id = window.location.hash.slice(1);
      if (id) {
        setActiveId(id);
        loadRecipe(id);
      }
    }

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [loadRecipe]);

  return (
    <div className="forkify-container">
      <Header activeId={activeId} onAddRecipeClick={() => setShowModal(true)} onAuthClick={() => setShowAuth(true)} />
      <SearchResults activeId={activeId} />
      <Recipe />
      {showModal && (
        <AddRecipeModal
          onClose={() => setShowModal(false)}
          onSignInClick={() => { setShowModal(false); setShowAuth(true) }}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
