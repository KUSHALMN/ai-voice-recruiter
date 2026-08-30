'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

function AuthListener({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && pathname === '/login') {
        const isAdmin = session.user.email?.includes('admin')
        const targetRoute = isAdmin ? '/admin' : '/dashboard'
        router.replace(targetRoute)
      }
      
      if (event === 'SIGNED_OUT' && pathname !== '/login') {
        router.replace('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, pathname])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <AuthListener>
        {children}
      </AuthListener>
      <Toaster position="top-right" />
    </SessionProvider>
  )
}