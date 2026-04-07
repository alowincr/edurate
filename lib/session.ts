import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase-admin'

export async function getSessionUser() {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) return null

    const { data: dbUser } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, university, is_verified, is_admin')
      .eq('email', user.email)
      .single()

    // Si no existe en nuestra tabla todavía, lo creamos al vuelo
    if (!dbUser) {
      const { data: newUser } = await supabaseAdmin
        .from('users')
        .insert({ email: user.email, is_verified: true })
        .select('id, email, full_name, university, is_verified, is_admin')
        .single()
      return newUser ?? null
    }

    return dbUser
  } catch {
    return null
  }
}