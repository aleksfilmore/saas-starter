'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, Heart, Shield, CheckCircle, Crown, Ghost } from 'lucide-react'
import PlanSelection from '@/components/subscription/PlanSelection'

type Step = 'plan' | 'account' | 'processing'
type PlanType = 'FREE' | 'PREMIUM'

function SignUpWithPlanContent() {
  const [currentStep, setCurrentStep] = useState<Step>('plan')
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('FREE')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [wantsNewsletter, setWantsNewsletter] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // searchParams can be null during the very first render in some environments; guard it
  const fromScan = searchParams?.get('from') === 'scan'

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.email.trim()) return 'Email is required'
    if (!formData.email.includes('@')) return 'Please enter a valid email'
    if (formData.password.length < 8) return 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    if (!agreedToTerms) return 'You must agree to the Terms of Service'
    return null
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    if (selectedPlan === 'PREMIUM') {
      // For premium plan, create account then redirect to Stripe
      await createAccountAndRedirectToStripe()
    } else {
      // For free plan, just create account
      await createFreeAccount()
    }
  }

  const createFreeAccount = async () => {
    setError('')
    setLoading(true)
    setCurrentStep('processing')

    try {
      // Get scan answers from localStorage if coming from scan
      let scanAnswers = null
      if (fromScan) {
        const savedAnswers = localStorage.getItem('scan_answers')
        if (savedAnswers) {
          scanAnswers = JSON.parse(savedAnswers)
        }
      }

      const response = await fetch('/api/signup-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          wantsNewsletter,
          subscriptionTier: 'FREE',
          scanAnswers
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('auth-token', data.token)
        }
        
        // Clear scan answers from localStorage
        if (fromScan) {
          localStorage.removeItem('scan_answers')
        }
        
        // Redirect to welcome page if from scan, otherwise dashboard
        const redirectTo = fromScan ? '/welcome' : '/dashboard?welcome=true'
        router.push(redirectTo)
      } else {
        setError(data.message || 'Account creation failed. Please try again.')
        setCurrentStep('account')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setCurrentStep('account')
    } finally {
      setLoading(false)
    }
  }

  const createAccountAndRedirectToStripe = async () => {
    setError('')
    setLoading(true)
    setCurrentStep('processing')

    try {
      // Get scan answers from localStorage if coming from scan
      let scanAnswers = null
      if (fromScan) {
        const savedAnswers = localStorage.getItem('scan_answers')
        if (savedAnswers) {
          scanAnswers = JSON.parse(savedAnswers)
        }
      }

      // First create the account
      const signupResponse = await fetch('/api/signup-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          wantsNewsletter,
          subscriptionTier: 'FREE', // Start as free, will be upgraded after payment
          scanAnswers
        }),
      })

      const signupData = await signupResponse.json()

      if (!signupResponse.ok) {
        setError(signupData.message || 'Account creation failed. Please try again.')
        setCurrentStep('account')
        setLoading(false)
        return
      }

      // Store auth token
      if (signupData.token) {
        localStorage.setItem('auth-token', signupData.token)
      }

      // Clear scan answers from localStorage
      if (fromScan) {
        localStorage.removeItem('scan_answers')
      }

      // Create Stripe checkout session
      const checkoutResponse = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${signupData.token}`
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/dashboard?welcome=true&upgraded=true`,
          cancelUrl: `${window.location.origin}/dashboard?welcome=true`
        }),
      })

      const checkoutData = await checkoutResponse.json()

      if (checkoutResponse.ok && checkoutData.url) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.url
      } else {
        // If checkout creation failed, still redirect to dashboard
        setError('Payment setup failed, but your account was created. You can upgrade later.')
        setTimeout(() => {
          const redirectTo = fromScan ? '/welcome' : '/dashboard?welcome=true'
          router.push(redirectTo)
        }, 2000)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setCurrentStep('account')
      setLoading(false)
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^A-Za-z0-9]/)) strength++
    return strength
  }

  const getStrengthLabel = (strength: number) => {
    if (strength < 2) return { label: 'Weak', color: 'text-red-600 bg-red-100' }
    if (strength < 4) return { label: 'Fair', color: 'text-yellow-600 bg-yellow-100' }
    return { label: 'Strong', color: 'text-green-600 bg-green-100' }
  }

  const strength = passwordStrength(formData.password)
  const strengthInfo = getStrengthLabel(strength)

  // Step 1: Plan Selection
  if (currentStep === 'plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CTRL+ALT+BLOCK
              </h1>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Welcome to Your Healing Journey</h2>
              <p className="text-gray-300">
                {fromScan 
                  ? "Your personalized scan is complete! Choose your plan to unlock your results."
                  : "Join thousands on their path to emotional wellness and breaking free from toxic patterns."
                }
              </p>
            </div>
          </div>

          <PlanSelection 
            selectedPlan={selectedPlan}
            onPlanSelect={setSelectedPlan}
            showTitle={false}
          />

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setCurrentStep('account')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-8 py-3"
            >
              Continue with {selectedPlan === 'FREE' ? '👻 Ghost' : '🔥 Firewall'} Mode
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-purple-400 hover:text-purple-300">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Account Creation
  if (currentStep === 'account') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CTRL+ALT+BLOCK
              </h1>
            </div>
            
            {/* Plan indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {selectedPlan === 'FREE' ? (
                <>
                  <Ghost className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">👻 Ghost Mode</span>
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-300">🔥 Firewall Mode</span>
                </>
              )}
            </div>
          </div>

          <Card className="shadow-xl border border-gray-700 bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep('plan')}
                  className="text-gray-400 hover:text-gray-300 p-0"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <div className="text-sm text-gray-400">Step 2 of 2</div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-white">Create Account</CardTitle>
              <CardDescription className="text-center text-gray-300">
                {selectedPlan === 'PREMIUM' 
                  ? "Create your account and complete payment to unlock Firewall Mode"
                  : "Create your free account to begin your healing journey"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSubmit} className="space-y-4">
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
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
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
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
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
                  {formData.password && (
                    <div className="flex items-center space-x-2 text-xs">
                      <div className={`px-2 py-1 rounded ${
                        strength < 2 ? 'text-red-400 bg-red-500/20' :
                        strength < 4 ? 'text-yellow-400 bg-yellow-500/20' :
                        'text-green-400 bg-green-500/20'
                      }`}>
                        {strengthInfo.label}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <CheckCircle className="absolute right-10 top-3 h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      className="mt-1 border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="newsletter"
                      checked={wantsNewsletter}
                      onCheckedChange={(checked) => setWantsNewsletter(checked === true)}
                      className="mt-1 border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor="newsletter" className="text-sm text-gray-300">
                      Send me helpful tips and updates about my healing journey
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !!validateForm()}
                  className={`w-full font-medium py-2.5 ${
                    selectedPlan === 'PREMIUM'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                  } text-white`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{selectedPlan === 'PREMIUM' ? 'Creating account...' : 'Creating free account...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{selectedPlan === 'PREMIUM' ? 'Create Account & Subscribe' : 'Create Free Account'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              {selectedPlan === 'PREMIUM' && (
                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-purple-400 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>You'll be redirected to secure Stripe checkout after account creation</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step 3: Processing
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {selectedPlan === 'PREMIUM' ? 'Setting up your Firewall Mode...' : 'Creating your account...'}
        </h2>
        <p className="text-gray-300">
          {selectedPlan === 'PREMIUM' 
            ? 'You\'ll be redirected to complete your subscription in just a moment.'
            : 'Welcome to your healing journey!'
          }
        </p>
        {error && (
          <Alert className="mt-4 border-red-500/50 bg-red-500/10 max-w-md mx-auto">
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default function SignUpWithPlanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpWithPlanContent />
    </Suspense>
  )
}
