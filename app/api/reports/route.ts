import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getSessionUser } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 })

    const { evaluation_id, reason, details } = await req.json()

    if (!evaluation_id || !reason) {
      return NextResponse.json({ error: 'evaluation_id y reason son requeridos' }, { status: 400 })
    }

    // Verificar que no haya reportado ya esta evaluación
    const { data: existing } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('evaluation_id', evaluation_id)
      .eq('reporter_user_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Ya reportaste esta evaluación' }, { status: 409 })
    }

    // Crear reporte
    await supabaseAdmin.from('reports').insert({
      evaluation_id,
      reporter_user_id: user.id,
      reason,
      details: details?.trim() || null,
    })

    // Incrementar contador de reportes en la evaluación
    await supabaseAdmin.rpc('increment_report_count', { eval_id: evaluation_id })

    // Si tiene 3+ reportes, ocultarla automáticamente
    const { data: eval_data } = await supabaseAdmin
      .from('evaluations')
      .select('reported_count')
      .eq('id', evaluation_id)
      .single()

    if (eval_data && eval_data.reported_count >= 3) {
      await supabaseAdmin
        .from('evaluations')
        .update({ is_approved: false })
        .eq('id', evaluation_id)
    }

    return NextResponse.json({ success: true, message: 'Reporte enviado. Gracias por ayudarnos a mantener la comunidad.' })
  } catch (err) {
    console.error('Error en POST reports:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}