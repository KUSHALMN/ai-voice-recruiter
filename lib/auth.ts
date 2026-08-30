import { supabase } from './supabase'

export interface AuthResponse {
  success: boolean
  error?: string
  user?: any
  session?: any
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        return { success: false, error: error.message }
      }
      
      const { error: dbError } = await supabase.from('users').insert({
        email,
        name,
        role: email.includes('admin') ? 'admin' : 'recruiter'
      })
      
      if (dbError) {
        console.error('Database insert error:', dbError)
      }
      
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Signup exception:', error)
      return { success: false, error: error.message || 'Signup failed' }
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Login error:', error)
        return { success: false, error: error.message }
      }
      
      if (!data.session) {
        return { success: false, error: 'No session created' }
      }
      
      return { success: true, user: data.user, session: data.session }
    } catch (error: any) {
      console.error('Login exception:', error)
      return { success: false, error: error.message || 'Login failed' }
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Signout error:', error)
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('Signout exception:', error)
      return { success: false, error: error.message || 'Signout failed' }
    }
  },

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Get session error:', error)
        return null
      }
      
      return data.session
    } catch (error) {
      console.error('Get session exception:', error)
      return null
    }
  }
}
