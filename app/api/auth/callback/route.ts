import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const next = req.nextUrl.searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(new URL('/auth?error=token_missing', req.url))
  }

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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.user) {
      console.error('Error en callback:', error)
      return NextResponse.redirect(new URL('/auth?error=token_invalid', req.url))
    }

    const email = data.user.email!

    // Crear o actualizar usuario en nuestra tabla
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (!existing) {
      await supabaseAdmin.from('users').insert({
        email,
        is_verified: true,
      })
    } else {
      await supabaseAdmin
        .from('users')
        .update({ is_verified: true })
        .eq('email', email)
    }

    return NextResponse.redirect(new URL(`${next}?verified=true`, req.url))
  } catch (err) {
    console.error('Error inesperado en callback:', err)
    return NextResponse.redirect(new URL('/auth?error=server_error', req.url))
  }
}