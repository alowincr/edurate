import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { moderateComment } from '@/lib/moderation'
import { getSessionUser } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para evaluar' },
        { status: 401 }
      )
    }

    if (!user.is_verified) {
      return NextResponse.json(
        { error: 'Debes verificar tu correo institucional antes de evaluar' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      professor_id,
      clarity,
      knowledge,
      methodology,
      punctuality,
      treatment,
      rigor,
      comment,
    } = body

    if (!professor_id) {
      return NextResponse.json(
        { error: 'Profesor requerido' },
        { status: 400 }
      )
    }

    const { data: professor } = await supabaseAdmin
      .from('professors')
      .select('id, full_name')
      .eq('id', professor_id)
      .single()

    if (!professor) {
      return NextResponse.json(
        { error: 'Profesor no encontrado' },
        { status: 404 }
      )
    }

    // Verificar evaluación duplicada
    const { data: existing } = await supabaseAdmin
      .from('evaluations')
      .select('id')
      .eq('user_id', user.id)
      .eq('professor_id', professor_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: `Ya evaluaste a ${professor.full_name}. Solo se permite una evaluación por docente.` },
        { status: 409 }
      )
    }

    // Validar criterios
    const scores = { clarity, knowledge, methodology, punctuality, treatment, rigor }
    for (const [key, val] of Object.entries(scores)) {
      if (!val || typeof val !== 'number' || val < 1 || val > 5) {
        return NextResponse.json(
          { error: `El criterio "${key}" debe tener valor entre 1 y 5` },
          { status: 400 }
        )
      }
    }

    const avg_score = Math.round(
      ((clarity + knowledge + methodology + punctuality + treatment + rigor) / 6) * 100
    ) / 100

    // Moderar comentario — si es tóxico se limpia pero igual se publica
    let clean_comment = comment?.trim() || null
    let flag_reason   = null

    if (clean_comment) {
      const mod = moderateComment(clean_comment)
      if (!mod.isClean) {
        // Bloquear completamente el comentario tóxico — se guarda sin comentario
        clean_comment = null
        flag_reason   = mod.flagReason || null
      }
    }

    const { data: evaluation, error } = await supabaseAdmin
      .from('evaluations')
      .insert({
        professor_id,
        user_id:      user.id,
        clarity,
        knowledge,
        methodology,
        punctuality,
        treatment,
        rigor,
        avg_score,
        comment:      clean_comment,
        is_approved:  true,   // siempre aprobada
        is_flagged:   false,  // ya no se usa moderación manual
        flag_reason,
        moderated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error al guardar evaluación:', error)
      return NextResponse.json(
        { error: 'Error interno al guardar evaluación' },
        { status: 500 }
      )
    }

    const message = flag_reason
      ? 'Evaluación enviada. Tu comentario fue eliminado por contener lenguaje inapropiado.'
      : 'Evaluación enviada exitosamente. ¡Gracias por contribuir!'

    return NextResponse.json({ success: true, evaluation, message })
  } catch (err) {
    console.error('Error en POST evaluations:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const professor_id = req.nextUrl.searchParams.get('professor_id')

    if (!professor_id) {
      return NextResponse.json(
        { error: 'professor_id requerido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('evaluations')
      .select('id, clarity, knowledge, methodology, punctuality, treatment, rigor, avg_score, comment, created_at')
      .eq('professor_id', professor_id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ evaluations: data })
  } catch (err) {
    console.error('Error en GET evaluations:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}