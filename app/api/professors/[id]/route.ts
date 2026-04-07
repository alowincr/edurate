import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: professor, error } = await supabaseAdmin
      .from('professors')
      .select(`
        id,
        full_name,
        university,
        department,
        photo_url,
        avg_rating,
        total_evaluations,
        courses (id, name, code)
      `)
      .eq('id', id)
      .single()

    if (error || !professor) {
      return NextResponse.json(
        { error: 'Profesor no encontrado' },
        { status: 404 }
      )
    }

    // Obtener evaluaciones aprobadas con detalle de criterios
    const { data: evaluations } = await supabaseAdmin
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
        created_at
      `)
      .eq('professor_id', id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(20)

    // Calcular promedios por criterio
    const criteriaAvg = evaluations && evaluations.length > 0
      ? {
          clarity: avg(evaluations.map(e => e.clarity)),
          knowledge: avg(evaluations.map(e => e.knowledge)),
          methodology: avg(evaluations.map(e => e.methodology)),
          punctuality: avg(evaluations.map(e => e.punctuality)),
          treatment: avg(evaluations.map(e => e.treatment)),
          rigor: avg(evaluations.map(e => e.rigor)),
        }
      : null

    return NextResponse.json({ professor, evaluations, criteriaAvg })
  } catch (err) {
    console.error('Error en GET professor by id:', err)
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    )
  }
}

function avg(nums: number[]): number {
  if (!nums.length) return 0
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}