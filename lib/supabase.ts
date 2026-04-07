import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// 1. Cliente para el Navegador (Usa NEXT_PUBLIC)
// Lo exportamos como función para asegurarnos de que se ejecute en el momento justo
export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Exportamos una instancia simple para componentes que la necesiten directamente
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 2. Cliente Administrativo (SOLO para el Servidor)
// Nota: Este NO debe usarse en componentes de cliente (use client)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Evitamos que truene si es undefined en el cliente
)