'use client';

import { useEffect, useState } from 'react';
import { useRecipe } from '@/context/RecipeContext';
import Header from '@/components/Header';
import SearchResults from '@/components/SearchResults';
import Recipe from '@/components/Recipe';
import AddRecipeModal from '@/components/AddRecipeModal';

export default function Home() {
  const { loadRecipe, initBookmarks } = useRecipe();
  const [activeId, setActiveId] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    initBookmarks();

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
  }, [loadRecipe, initBookmarks]);

  return (
    <div className="forkify-container">
      <Header activeId={activeId} onAddRecipeClick={() => setShowModal(true)} />
      <SearchResults activeId={activeId} />
      <Recipe />
      {showModal && <AddRecipeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
