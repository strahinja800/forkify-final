'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

type Props = {
  onClose: () => void
}

type Tab = 'login' | 'register'

export default function AuthModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Incorrect email or password.')
    } else {
      onClose()
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      let data: { error?: string; ok?: boolean } = {}
      try {
        data = await res.json()
      } catch {
        // response body was not valid JSON (e.g. server 500 HTML page)
      }
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Registration succeeded but sign-in failed. Try logging in.')
      } else {
        onClose()
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full text-[1.5rem] px-[1.2rem] py-[0.9rem] border border-[#ddd] rounded-[0.5rem] transition-all duration-200 focus:outline-none focus:border-[#f38e82] focus:bg-[#f9f5f3] placeholder:text-[#d3c7c3]'

  return (
    <>
      <div
        onClick={onClose}
        className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]'
      />
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] bg-white rounded-[9px] px-[4rem] py-[4rem] shadow-[0_4rem_6rem_rgba(0,0,0,0.25)] z-[1000]'>
        <button
          onClick={onClose}
          className='absolute top-[0.5rem] right-[1.6rem] text-[3.5rem] font-[inherit] text-inherit bg-transparent border-none cursor-pointer focus:outline-none'
        >
          &times;
        </button>

        <div className='flex mb-[3rem] border-b border-[#f2efee]'>
          {(['login', 'register'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => {
                setTab(t)
                setError('')
                setName('')
                setEmail('')
                setPassword('')
              }}
              className={`flex-1 pb-[1rem] text-[1.5rem] font-bold uppercase border-none bg-transparent cursor-pointer transition-all duration-200 focus:outline-none ${
                tab === t
                  ? 'text-[#f38e82] border-b-2 border-[#f38e82]'
                  : 'text-[#918581] hover:text-[#f38e82]'
              }`}
            >
              {t === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        <form
          onSubmit={tab === 'login' ? handleLogin : handleRegister}
          className='flex flex-col gap-[1.5rem]'
        >
          {tab === 'register' && (
            <input
              type='text'
              placeholder='Your name'
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputClass}
            />
          )}
          <input
            type='email'
            placeholder='Email address'
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type='password'
            placeholder='Password'
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={inputClass}
          />

          {error && (
            <p className='text-[1.3rem] text-red-500 font-semibold'>{error}</p>
          )}

          <button
            type='submit'
            disabled={loading}
            className='mt-[1rem] flex items-center justify-center gap-[0.8rem] px-[3rem] py-[1.2rem] bg-gradient-to-br from-[#fbdb89] to-[#f48982] rounded-full text-white uppercase font-semibold text-[1.4rem] border-none cursor-pointer transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none'
          >
            {loading ? (
              <svg className='h-[2rem] w-[2rem] fill-white animate-spin-slow'>
                <use href='/icons.svg#icon-loader' />
              </svg>
            ) : tab === 'login' ? (
              'Sign in'
            ) : (
              'Create account'
            )}
          </button>
        </form>
      </div>
    </>
  )
}
