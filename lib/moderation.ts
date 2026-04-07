const TOXIC_WORDS = [
  'idiota', 'imbécil', 'estúpido', 'inútil', 'mierda', 'puto', 'puta',
  'basura', 'asco', 'horrible', 'odio', 'maldito', 'animal', 'burro',
  'flojo', 'corrupto', 'ladrón', 'mentiroso', 'incompetente', 'trash',
  'sucks', 'hate', 'damn', 'crap'
]

export interface ModerationResult {
  isClean: boolean
  flagReason?: string
}

export function moderateComment(text: string): ModerationResult {
  if (!text || text.trim().length === 0) {
    return { isClean: true }
  }

  const lower = text.toLowerCase()

  // Verificar palabras tóxicas
  const found = TOXIC_WORDS.filter(w => lower.includes(w))
  if (found.length > 0) {
    return {
      isClean: false,
      flagReason: `Lenguaje inapropiado: ${found.join(', ')}`,
    }
  }

  // Verificar todo en mayúsculas (tono agresivo)
  // Solo aplica si es texto largo, no palabras cortas
  if (text.trim().length > 15) {
    const letters = text.match(/[a-záéíóúñA-ZÁÉÍÓÚÑ]/g) || []
    const upperCount = text.match(/[A-ZÁÉÍÓÚÑ]/g)?.length || 0
    if (letters.length > 0 && upperCount / letters.length > 0.7) {
      return {
        isClean: false,
        flagReason: 'Posible tono agresivo (todo en mayúsculas)',
      }
    }
  }

  return { isClean: true }
}