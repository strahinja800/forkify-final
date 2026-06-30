'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react'
import { useSession } from 'next-auth/react'
import { ajax } from '@/lib/api'
import { API_URL, KEY, RES_PER_PAGE } from '@/lib/config'

export type Ingredient = {
  quantity: number | null
  unit: string
  description: string
}

export type Recipe = {
  id: string
  title: string
  publisher: string
  sourceUrl: string
  image: string
  servings: number
  cookingTime: number
  ingredients: Ingredient[]
  key?: string
  bookmarked?: boolean
}

export type RecipePreview = {
  id: string
  title: string
  publisher: string
  image: string
  key?: string
}

type SearchState = {
  query: string
  results: RecipePreview[]
  page: number
  resultsPerPage: number
}

type State = {
  recipe: Recipe | null
  search: SearchState
  bookmarks: Recipe[]
  localRecipes: Recipe[]
  loading: boolean
  error: string | null
  searchLoading: boolean
}

type Action =
  | { type: 'LOAD_RECIPE_START' }
  | { type: 'LOAD_RECIPE_SUCCESS'; payload: Recipe }
  | { type: 'LOAD_RECIPE_ERROR'; payload: string }
  | { type: 'SEARCH_START'; payload: string }
  | { type: 'SEARCH_SUCCESS'; payload: RecipePreview[] }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'UPDATE_SERVINGS'; payload: number }
  | { type: 'ADD_BOOKMARK'; payload: Recipe }
  | { type: 'REMOVE_BOOKMARK'; payload: string }
  | { type: 'INIT_BOOKMARKS'; payload: Recipe[] }
  | { type: 'ADD_LOCAL_RECIPE'; payload: Recipe }
  | { type: 'RESET_LOCAL_RECIPES' }

function decodeHtml(str: string): string {
  if (typeof document === 'undefined') return str
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

function loadBookmarksFromStorage(): Recipe[] {
  try {
    const stored = localStorage.getItem('bookmarks')
    const parsed: Recipe[] = stored ? JSON.parse(stored) : []
    const valid = parsed.filter(b => !b.id.startsWith('local-'))
    if (valid.length !== parsed.length) {
      localStorage.setItem('bookmarks', JSON.stringify(valid))
    }
    return valid
  } catch {
    return []
  }
}

function saveBookmarksToStorage(bookmarks: Recipe[]) {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
}

const initialState: State = {
  recipe: null,
  search: { query: '', results: [], page: 1, resultsPerPage: RES_PER_PAGE },
  bookmarks: [],
  localRecipes: [],
  loading: false,
  error: null,
  searchLoading: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_RECIPE_START':
      return { ...state, loading: true, error: null }
    case 'LOAD_RECIPE_SUCCESS':
      return { ...state, loading: false, recipe: action.payload }
    case 'LOAD_RECIPE_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SEARCH_START':
      return {
        ...state,
        searchLoading: true,
        error: null,
        search: { ...state.search, query: action.payload },
      }
    case 'SEARCH_SUCCESS':
      return {
        ...state,
        searchLoading: false,
        search: { ...state.search, results: action.payload, page: 1 },
      }
    case 'SEARCH_ERROR':
      return { ...state, searchLoading: false, error: action.payload }
    case 'SET_PAGE':
      return { ...state, search: { ...state.search, page: action.payload } }
    case 'UPDATE_SERVINGS': {
      if (!state.recipe) return state
      const ratio = action.payload / state.recipe.servings
      return {
        ...state,
        recipe: {
          ...state.recipe,
          servings: action.payload,
          ingredients: state.recipe.ingredients.map(ing => ({
            ...ing,
            quantity: ing.quantity ? ing.quantity * ratio : null,
          })),
        },
      }
    }
    case 'ADD_BOOKMARK': {
      const bookmarks = [...state.bookmarks, action.payload]
      return {
        ...state,
        bookmarks,
        recipe: state.recipe
          ? { ...state.recipe, bookmarked: true }
          : state.recipe,
      }
    }
    case 'REMOVE_BOOKMARK': {
      const bookmarks = state.bookmarks.filter(b => b.id !== action.payload)
      return {
        ...state,
        bookmarks,
        recipe: state.recipe
          ? { ...state.recipe, bookmarked: false }
          : state.recipe,
      }
    }
    case 'INIT_BOOKMARKS': {
      const isCurrentBookmarked = state.recipe
        ? action.payload.some(b => b.id === state.recipe!.id)
        : false
      return {
        ...state,
        bookmarks: action.payload,
        recipe: state.recipe
          ? { ...state.recipe, bookmarked: isCurrentBookmarked }
          : state.recipe,
      }
    }
    case 'ADD_LOCAL_RECIPE':
      return { ...state, localRecipes: [action.payload, ...state.localRecipes] }
    case 'RESET_LOCAL_RECIPES':
      return { ...state, localRecipes: [] }
    default:
      return state
  }
}

type ContextValue = {
  state: State
  loadRecipe: (id: string) => Promise<void>
  loadSearchResults: (query: string) => Promise<void>
  getSearchResultsPage: (page?: number) => RecipePreview[]
  setPage: (page: number) => void
  updateServings: (n: number) => void
  addBookmark: (recipe: Recipe) => void
  removeBookmark: (id: string) => void
  uploadRecipe: (data: Record<string, string>) => Promise<void>
}

const RecipeContext = createContext<ContextValue | null>(null)

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { data: session, status } = useSession()

  const localRecipesRef = useRef(state.localRecipes)
  useEffect(() => {
    localRecipesRef.current = state.localRecipes
  }, [state.localRecipes])

  const bookmarksRef = useRef(state.bookmarks)
  useEffect(() => {
    bookmarksRef.current = state.bookmarks
  }, [state.bookmarks])

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated') {
      fetch('/api/bookmarks')
        .then(r => r.json())
        .then(data =>
          dispatch({ type: 'INIT_BOOKMARKS', payload: data.bookmarks ?? [] }),
        )
        .catch(() => {})

      dispatch({ type: 'RESET_LOCAL_RECIPES' })
      fetch('/api/recipes')
        .then(r => r.json())
        .then(data => {
          ;(data.recipes ?? [])
            .slice()
            .reverse()
            .forEach((r: Recipe) =>
              dispatch({ type: 'ADD_LOCAL_RECIPE', payload: r }),
            )
        })
        .catch(() => {})
    } else {
      dispatch({ type: 'INIT_BOOKMARKS', payload: loadBookmarksFromStorage() })
      dispatch({ type: 'RESET_LOCAL_RECIPES' })
    }
  }, [status])

  const loadRecipe = useCallback(async (id: string) => {
    const local = localRecipesRef.current.find(r => r.id === id)
    if (local) {
      dispatch({
        type: 'LOAD_RECIPE_SUCCESS',
        payload: { ...local, bookmarked: bookmarksRef.current.some(b => b.id === id) },
      })
      return
    }

    dispatch({ type: 'LOAD_RECIPE_START' })
    try {
      const data = await ajax(`${API_URL}/${id}?key=${KEY}`)
      const { recipe } = data.data as { recipe: Record<string, unknown> }
      const loaded: Recipe = {
        id: recipe.id as string,
        title: decodeHtml(recipe.title as string),
        publisher: decodeHtml(recipe.publisher as string),
        sourceUrl: recipe.source_url as string,
        image: recipe.image_url as string,
        servings: recipe.servings as number,
        cookingTime: recipe.cooking_time as number,
        ingredients: recipe.ingredients as Ingredient[],
        ...(recipe.key ? { key: recipe.key as string } : {}),
      }
      loaded.bookmarked = bookmarksRef.current.some(b => b.id === id)
      dispatch({ type: 'LOAD_RECIPE_SUCCESS', payload: loaded })
    } catch (err) {
      dispatch({ type: 'LOAD_RECIPE_ERROR', payload: (err as Error).message })
    }
  }, [])

  const loadSearchResults = useCallback(async (query: string) => {
    dispatch({ type: 'SEARCH_START', payload: query })
    try {
      const data = await ajax(`${API_URL}?search=${query}&key=${KEY}`)
      const results: RecipePreview[] = (
        (data.data?.recipes ?? []) as Record<string, unknown>[]
      ).map(rec => ({
        id: rec.id as string,
        title: decodeHtml(rec.title as string),
        publisher: decodeHtml(rec.publisher as string),
        image: rec.image_url as string,
        ...(rec.key ? { key: rec.key as string } : {}),
      }))
      dispatch({ type: 'SEARCH_SUCCESS', payload: results })
    } catch (err) {
      dispatch({ type: 'SEARCH_ERROR', payload: (err as Error).message })
    }
  }, [])

  const getSearchResultsPage = useCallback(
    (page = state.search.page) => {
      const start = (page - 1) * state.search.resultsPerPage
      const end = page * state.search.resultsPerPage
      return state.search.results.slice(start, end)
    },
    [state.search],
  )

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page })
  }, [])

  const updateServings = useCallback((n: number) => {
    dispatch({ type: 'UPDATE_SERVINGS', payload: n })
  }, [])

  const addBookmark = useCallback(
    (recipe: Recipe) => {
      dispatch({ type: 'ADD_BOOKMARK', payload: recipe })
      if (session) {
        fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceId: recipe.id, snapshot: recipe }),
        }).catch(() => {})
      } else {
        const current = loadBookmarksFromStorage()
        saveBookmarksToStorage([...current, recipe])
      }
    },
    [session],
  )

  const removeBookmark = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: id })
      if (session) {
        fetch(`/api/bookmarks?sourceId=${id}`, { method: 'DELETE' }).catch(
          () => {},
        )
      } else {
        const current = loadBookmarksFromStorage()
        saveBookmarksToStorage(current.filter(b => b.id !== id))
      }
    },
    [session],
  )

  const uploadRecipe = useCallback(
    async (newRecipe: Record<string, string>) => {
      if (!session) throw new Error('Please sign in to upload a recipe.')

      const ingredients = Object.entries(newRecipe)
        .filter(([key, val]) => key.startsWith('ingredient') && val !== '')
        .map(([, val]) => {
          const parts = val.split(',').map(s => s.trim())
          if (parts.length !== 3)
            throw new Error(
              "Wrong ingredient format! Please use: 'Quantity,Unit,Description'",
            )
          const [quantity, unit, description] = parts
          return { quantity: quantity ? +quantity : null, unit, description }
        })

      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newRecipe.title,
          sourceUrl: newRecipe.sourceUrl,
          image: newRecipe.image,
          publisher: newRecipe.publisher,
          cookingTime: +newRecipe.cookingTime,
          servings: +newRecipe.servings,
          ingredients,
        }),
      })

      if (!res.ok) throw new Error('Failed to upload recipe. Please try again.')

      const { recipe } = await res.json()
      dispatch({
        type: 'ADD_LOCAL_RECIPE',
        payload: { ...recipe, bookmarked: true },
      })
      dispatch({
        type: 'LOAD_RECIPE_SUCCESS',
        payload: { ...recipe, bookmarked: true },
      })
      addBookmark(recipe)
    },
    [session, addBookmark],
  )

  return (
    <RecipeContext.Provider
      value={{
        state,
        loadRecipe,
        loadSearchResults,
        getSearchResultsPage,
        setPage,
        updateServings,
        addBookmark,
        removeBookmark,
        uploadRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipe() {
  const ctx = useContext(RecipeContext)
  if (!ctx) throw new Error('useRecipe must be used inside RecipeProvider')
  return ctx
}
