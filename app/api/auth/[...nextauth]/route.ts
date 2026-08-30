import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      httpOptions: {
        timeout: 10000,
      }
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()

        if (!existingUser) {
          const isAdmin = user.email.includes('admin') || user.email === 'kkiran6094@gmail.com' || user.email === 'kushikushal416@gmail.com'
          await supabase.from('users').insert({
            email: user.email,
            name: user.name || 'User',
            role: isAdmin ? 'admin' : 'recruiter'
          })
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session?.user) {
        const isAdmin = session.user.email?.includes('admin') || session.user.email === 'kkiran6094@gmail.com' || session.user.email === 'kushikushal416@gmail.com'
        ;(session.user as any).id = token.sub || ''
        ;(session.user as any).role = isAdmin ? 'admin' : 'recruiter'
      }
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        const isAdmin = user.email?.includes('admin') || user.email === 'kkiran6094@gmail.com' || user.email === 'kushikushal416@gmail.com'
        token.role = isAdmin ? 'admin' : 'recruiter'
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }