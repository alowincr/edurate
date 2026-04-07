import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Forzamos la lectura de variables con valores por defecto para que el BUILD no falle,
// pero el RUNTIME nos diga qué falta.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 1. Cliente para el Navegador
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🚨 ERROR CRÍTICO: Variables de Supabase ausentes en el cliente.");
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// 2. Cliente Administrativo (Solo Servidor)
// Solo lo inicializamos si tenemos las llaves, para que no rompa el cliente
export const supabaseAdmin = (process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null as any; // En el navegador esto será null y no dará error