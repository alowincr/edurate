import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getSessionUser } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    const search     = req.nextUrl.searchParams.get('search') || ''
    const university = req.nextUrl.searchParams.get('university') || ''
    const page       = parseInt(req.nextUrl.searchParams.get('page') || '1')
    const limit      = 12
    const offset     = (page - 1) * limit

    let query = supabaseAdmin
      .from('professors')
      .select(
        `id, full_name, university, department, photo_url,
         avg_rating, total_evaluations,
         courses (id, name, code)`,
        { count: 'exact' }
      )
      .order('avg_rating', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search)     query = query.ilike('full_name', `%${search}%`)
    if (university) query = query.ilike('university', `%${university}%`)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      professors: data ?? [],
      total:      count ?? 0,
      page,
      totalPages: Math.ceil((count ?? 0) / limit),
    })
  } catch (err) {
    console.error('Error en GET professors:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 })
    }
    if (!user.is_verified) {
      return NextResponse.json({ error: 'Debes verificar tu correo' }, { status: 403 })
    }

    const body = await req.json()
    const { full_name, university, department, courses } = body

    if (!full_name?.trim() || !university?.trim()) {
      return NextResponse.json({ error: 'Nombre y universidad son obligatorios' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('professors')
      .select('id, full_name')
      .ilike('full_name', full_name.trim())
      .ilike('university', university.trim())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: `"${existing.full_name}" ya está registrado en ${university}` },
        { status: 409 }
      )
    }

    const { data: professor, error } = await supabaseAdmin
      .from('professors')
      .insert({ full_name: full_name.trim(), university: university.trim(), department: department?.trim() || null })
      .select()
      .single()

    if (error || !professor) {
      return NextResponse.json({ error: 'Error al guardar el profesor' }, { status: 500 })
    }

    if (courses && Array.isArray(courses) && courses.length > 0) {
      const coursesData = courses
        .filter((c: any) => c?.name?.trim())
        .map((c: any) => ({ professor_id: professor.id, name: c.name.trim(), code: c.code?.trim() || null }))

      if (coursesData.length > 0) {
        const { error: ce } = await supabaseAdmin.from('courses').insert(coursesData)
        if (ce) console.error('Error cursos:', ce)
      }
    }

    const { data: full } = await supabaseAdmin
      .from('professors')
      .select('*, courses(id, name, code)')
      .eq('id', professor.id)
      .single()

    return NextResponse.json({ professor: full }, { status: 201 })
  } catch (err) {
    console.error('Error en POST professors:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}