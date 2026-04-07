import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getSessionUser } from '@/lib/session'

// GET — listar evaluaciones pendientes de moderación
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser()

    if (!user?.is_admin) {
      return NextResponse.json({ error: 'Sin permisos de administrador' }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from('evaluations')
      .select(`
        id,
        clarity,
        knowledge,
        methodology,
        punctuality,
        treatment,
        rigor,
        avg_score,
        comment,
        is_approved,
        is_flagged,
        flag_reason,
        created_at,
        professors (id, full_name, university)
      `)
      .eq('is_flagged', true)
      .eq('is_approved', false)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ evaluations: data })
  } catch (err) {
    console.error('Error en GET moderate:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// PATCH — aprobar o rechazar una evaluación
export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser()

    if (!user?.is_admin) {
      return NextResponse.json({ error: 'Sin permisos de administrador' }, { status: 403 })
    }

    const { evaluation_id, action } = await req.json()

    if (!evaluation_id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'evaluation_id y action (approve/reject) son requeridos' },
        { status: 400 }
      )
    }

    const updateData =
      action === 'approve'
        ? { is_approved: true, is_flagged: false }
        : { is_approved: false, is_flagged: true }

    const { data, error } = await supabaseAdmin
      .from('evaluations')
      .update(updateData)
      .eq('id', evaluation_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      evaluation: data,
      message: action === 'approve' ? 'Evaluación aprobada' : 'Evaluación rechazada',
    })
  } catch (err) {
    console.error('Error en PATCH moderate:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}