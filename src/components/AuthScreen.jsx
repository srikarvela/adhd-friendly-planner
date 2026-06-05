import { useState } from 'react'

export default function AuthScreen({ onSignIn, onSignUp, onReset }) {
  const [mode, setMode]       = useState('signin') // 'signin' | 'signup' | 'reset'
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [info, setInfo]       = useState('')

  async function submit() {
    setError(''); setInfo(''); setLoading(true)
    let err
    if (mode === 'signin')  err = await onSignIn(email, password)
    if (mode === 'signup')  err = await onSignUp(email, password)
    if (mode === 'reset')   err = await onReset(email)
    setLoading(false)
    if (err) { setError(err.message); return }
    if (mode === 'reset') setInfo('Check your email for a reset link.')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#000' }}>
      {/* Logo / title */}
      <div className="mb-10 text-center">
        <div className="text-[52px] mb-2">🗓️</div>
        <h1 className="text-[28px] font-bold tracking-tight" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif', color: 'rgba(255,255,255,0.95)' }}>
          Day Planner
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'rgba(235,235,245,0.4)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
          {mode === 'signin' ? 'Sign in to sync across devices' : mode === 'signup' ? 'Create an account to get started' : 'Reset your password'}
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(24px)' }}>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Email"
          autoComplete="email"
          className="w-full rounded-2xl px-4 py-3.5 text-[15px] mb-3 focus:outline-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.9)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}
        />

        {mode !== 'reset' && (
          <input
            type="password"
            value={password}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className="w-full rounded-2xl px-4 py-3.5 text-[15px] mb-4 focus:outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.9)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}
          />
        )}

        {error && <p className="text-[13px] mb-3 px-1" style={{ color: '#FF453A', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{error}</p>}
        {info  && <p className="text-[13px] mb-3 px-1" style={{ color: '#30D158', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{info}</p>}

        <button
          onClick={submit}
          disabled={loading || !email || (mode !== 'reset' && !password)}
          className="w-full py-3.5 rounded-2xl font-bold text-[16px] text-white mb-4 transition-opacity"
          style={{
            background: 'linear-gradient(135deg, #409CFF, #BF5AF2)',
            opacity: loading || !email || (mode !== 'reset' && !password) ? 0.5 : 1,
            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          }}
        >
          {loading ? '…' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
        </button>

        {/* Toggle links */}
        <div className="flex flex-col items-center gap-2">
          {mode === 'signin' && <>
            <button onClick={() => { setMode('signup'); setError(''); setInfo('') }} className="text-[14px] font-medium" style={{ color: '#409CFF', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Don't have an account? Sign up
            </button>
            <button onClick={() => { setMode('reset'); setError(''); setInfo('') }} className="text-[12px]" style={{ color: 'rgba(235,235,245,0.35)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Forgot password?
            </button>
          </>}
          {mode === 'signup' && (
            <button onClick={() => { setMode('signin'); setError(''); setInfo('') }} className="text-[14px] font-medium" style={{ color: '#409CFF', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Already have an account? Sign in
            </button>
          )}
          {mode === 'reset' && (
            <button onClick={() => { setMode('signin'); setError(''); setInfo('') }} className="text-[14px] font-medium" style={{ color: '#409CFF', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
