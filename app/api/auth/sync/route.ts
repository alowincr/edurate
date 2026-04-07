import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error en sync:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}