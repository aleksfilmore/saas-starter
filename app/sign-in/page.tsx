'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart, Shield } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('auth-token', data.token)
        }
        // Store user data
        if (data.data) {
          localStorage.setItem('user-email', data.data.email)
          localStorage.setItem('user-id', data.data.userId)
          localStorage.setItem('user-role', data.data.role || 'user')
          if (data.data.quizResult) {
            localStorage.setItem('quizResult', JSON.stringify(data.data.quizResult))
            localStorage.setItem('attachmentStyle', data.data.quizResult.attachmentStyle)
          }
        }
        router.push('/dashboard')
      } else {
        setError(data.message || 'Sign in failed. Please check your credentials.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-1 text-2xl font-extrabold tracking-tight text-white mb-4">
            <span>CTRL</span>
            <span className="text-gray-400">+</span>
            <span>ALT</span>
            <span className="text-gray-400">+</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
          </Link>
          <p className="text-gray-300">Welcome back to your healing journey</p>
        </div>

        <Card className="shadow-xl border border-gray-600/50 bg-gray-800/90 backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Continue your personalized healing experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-purple-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link 
                  href="/forgot-password" 
                  className="text-purple-400 hover:text-purple-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2.5"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-800 px-4 text-gray-400">New to CTRL+ALT+BLOCK?</span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/sign-up">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500"
                >
                  Create Account
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-purple-400">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Your privacy is protected</span>
              </div>
              <p className="text-xs text-purple-300 mt-1">
                All data is encrypted and securely stored. We never share your personal information.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-400">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-purple-400 hover:text-purple-300 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}