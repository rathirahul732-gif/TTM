'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    setError('')

    if (isSignup) {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        })
        if (result?.ok) {
          router.push('/dashboard')
        } else {
          setError('Unable to sign in after signup.')
        }
      } else {
        setError('Signup failed. Please try again.')
      }
    } else {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      if (result?.ok) {
        router.push('/dashboard')
      } else {
        setError('Invalid email or password.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl shadow-slate-950/50 backdrop-blur-lg">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="px-8 py-10 sm:px-12 sm:py-12">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Team Task Manager</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Secure your workflow with a modern task hub.</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
                Sign in to organize projects, assign tasks, and keep your team aligned in one place.
              </p>
            </div>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4">
                <p className="font-semibold text-slate-100">Fast access</p>
                <p className="mt-1">Login or create an account in seconds with email and password.</p>
              </div>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4">
                <p className="font-semibold text-slate-100">Team ready</p>
                <p className="mt-1">Built for managers, developers, and stakeholders with role-aware sessions.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-slate-950 px-8 py-10 sm:px-10 sm:py-12">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{isSignup ? 'Create account' : 'Welcome back'}</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{isSignup ? 'Register' : 'Sign in'}</h2>
            </div>
            {error && <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-200">
                Email
                <input
                  {...register('email')}
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                />
              </label>
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-200">
                Password
                <input
                  {...register('password')}
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                />
              </label>
              {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-sky-400"
            >
              {isSignup ? 'Create account' : 'Continue'}
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700"
            >
              {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
