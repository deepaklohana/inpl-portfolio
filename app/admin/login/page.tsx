'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  // Check for NextAuth error in URL params
  const urlError = searchParams.get('error')
  const displayError =
    error || (urlError === 'CredentialsSignin' ? 'Invalid email or password' : urlError ? 'An error occurred' : null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/admin',
      })
    } catch (err: unknown) {
      // NextAuth v5 throws NEXT_REDIRECT on success (redirect behavior)
      // If we reach here with an actual error, show it
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        // This is expected — redirect will happen
        return
      }
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-50/50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-indigo-50/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 outline outline-blue-50 rounded-xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Sign in to access your administrative dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {displayError && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">
                !
              </div>
              <p className="text-sm text-red-600 font-medium leading-relaxed">{displayError}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email-address">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-gray-50 hover:bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
