'use client'

import { useState, useEffect } from 'react'
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
  const [particles, setParticles] = useState<Array<{left: string, animationDelay: string, animationDuration: string, className: string}>>([])
  const router = useRouter()

  // Initialize particles on client side only to avoid hydration mismatch
  useEffect(() => {
    const particleTypes = ['particle-purple', 'particle-pink', 'particle-blue', 'particle-green'];
    const newParticles = [...Array(15)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
      className: particleTypes[i % 4]
    }));
    setParticles(newParticles);
    // Sync any browser autofill after initial paint (password managers often fill silently)
    const syncAutofill = () => {
      const emailEl = document.getElementById('email') as HTMLInputElement | null
      const passEl = document.getElementById('password') as HTMLInputElement | null
      if (emailEl && emailEl.value && !email) setEmail(emailEl.value)
      if (passEl && passEl.value && !password) setPassword(passEl.value)
    }
    // Run twice: immediate and delayed to catch late autofill
    syncAutofill()
    const t = setTimeout(syncAutofill, 150)
    // Poll a few more times in case the password manager injects later
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      syncAutofill()
      if (attempts > 10 || (email && password)) {
        clearInterval(interval)
      }
    }, 300)
    return () => clearTimeout(t)
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session management
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Lucia handles sessions via cookies, no need for localStorage tokens
        console.log('✅ Login successful:', data.user)
        
        // Set email in localStorage for dashboard compatibility
        if (data.user && data.user.email) {
          localStorage.setItem('user-email', data.user.email);
        }
        
  // Determine destination: prefer admin flag returned from API (future-proof)
  const isAdmin = data.user?.isAdmin || data.user?.is_admin || data.user?.email === 'system_admin@ctrlaltblock.com';
  router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Floating Particles */}
      <div className="particle-system">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`particle ${particle.className}`}
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/admin" className="flex items-center justify-center gap-1 text-2xl font-extrabold tracking-tight text-white mb-4">
            <span>CTRL</span>
            <span className="text-gray-400">+</span>
            <span>ALT</span>
            <span className="text-gray-400">+</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent brand-glitch" data-text="BLOCK">BLOCK</span>
          </Link>
          <p className="text-gray-300">Welcome back to your healing journey</p>
        </div>

        <Card className="card-brand neon-border-purple">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-glow-purple">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-brand-glow">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-300">
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
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                    className="pl-10 border-purple-500/30 bg-gray-800/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 neon-border-purple"
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
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                    className="pl-10 pr-10 border-purple-500/30 bg-gray-800/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 neon-border-purple"
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
                disabled={loading}
                className="w-full btn-brand-primary py-3"
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