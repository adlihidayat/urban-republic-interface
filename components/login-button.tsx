'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Chrome, ArrowRight, UserIcon } from 'lucide-react'
import { removeGroqKeyAction } from '@/app/actions/auth-actions'

export function LoginButton() {
  const supabase = createClient()

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing in with Google:', error.message)
    }
  }

  return (
    <Button 
      onClick={signInWithGoogle}
      className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
    >
      <Chrome className="h-4 w-4" />
      Continue with Google
    </Button>
  )
}

export function LogoutButton() {
  const supabase = createClient()

  const signOut = async () => {
    await removeGroqKeyAction()
    const { error } = await supabase.auth.signOut()
    // Clear guest cookie too just in case
    document.cookie = "is_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      window.location.reload()
    }
  }

  return (
    <Button 
      onClick={signOut}
      variant="ghost" 
      size="sm"
      className="text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
    >
      Sign out
    </Button>
  )
}

export function GuestLoginButton() {
  const handleGuestLogin = () => {
    // Set a cookie that expires in 24 hours
    const date = new Date()
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000))
    document.cookie = `is_guest=true; path=/; expires=${date.toUTCString()}; SameSite=Lax`
    window.location.href = '/'
  }

  return (
    <Button 
      onClick={handleGuestLogin}
      variant="ghost" 
      className="flex w-full items-center justify-center gap-2 rounded-2xl text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
    >
      Continue as Guest
      <ArrowRight className="h-3.5 w-3.5" />
    </Button>
  )
}
