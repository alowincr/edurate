import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { moderateComment } from '@/lib/moderation'
import { getSessionUser } from '@/lib/session'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { id } = await params

    const { data: existing } = await supabaseAdmin
      .from('evaluations')
      .select('id, user_id')
      .eq('id', id)
      .single()

    if (!existing) return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 })
    if (existing.user_id !== user.id) return NextResponse.json({ error: 'No puedes editar esta evaluación' }, { status: 403 })

    const body = await req.json()
    const { clarity, knowledge, methodology, punctuality, treatment, rigor, comment } = body

    const scores = { clarity, knowledge, methodology, punctuality, treatment, rigor }
    for (const [key, val] of Object.entries(scores)) {
      if (!val || typeof val !== 'number' || val < 1 || val > 5) {
        return NextResponse.json({ error: `El criterio "${key}" debe tener valor entre 1 y 5` }, { status: 400 })
      }
    }

    const avg_score = Math.round(
      ((clarity + knowledge + methodology + punctuality + treatment + rigor) / 6) * 100
    ) / 100

    let clean_comment = comment?.trim() || null
    if (clean_comment) {
      const mod = moderateComment(clean_comment)
      if (!mod.isClean) clean_comment = null
    }

    const { data: evaluation, error } = await supabaseAdmin
      .from('evaluations')
      .update({
        clarity, knowledge, methodology, punctuality, treatment, rigor,
        avg_score,
        comment:      clean_comment,
        moderated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })

    const message = clean_comment !== (comment?.trim() || null)
      ? 'Evaluación actualizada. El comentario fue eliminado por lenguaje inapropiado.'
      : 'Evaluación actualizada correctamente.'

    return NextResponse.json({ success: true, evaluation, message })
  } catch (err) {
    console.error('Error en PATCH evaluation:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { id } = await params

    const { data: existing } = await supabaseAdmin
      .from('evaluations')
      .select('id, user_id, professor_id')
      .eq('id', id)
      .single()

    if (!existing) return NextResponse.json({ error: 'Evaluación no encontrada' }, { status: 404 })
    if (existing.user_id !== user.id) return NextResponse.json({ error: 'No puedes eliminar esta evaluación' }, { status: 403 })

    const professor_id = existing.professor_id

    // Eliminar la evaluación
    const { error } = await supabaseAdmin
      .from('evaluations')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })

    // Verificar cuántas evaluaciones quedan para este profesor
    const { count } = await supabaseAdmin
      .from('evaluations')
      .select('id', { count: 'exact', head: true })
      .eq('professor_id', professor_id)
      .eq('is_approved', true)

    // Si no quedan evaluaciones, resetear el promedio a 0
    if (count === 0) {
      await supabaseAdmin
        .from('professors')
        .update({ avg_rating: 0, total_evaluations: 0 })
        .eq('id', professor_id)
    }

    return NextResponse.json({ success: true, message: 'Evaluación eliminada' })
  } catch (err) {
    console.error('Error en DELETE evaluation:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}