import { CJ_MIN, CJ_MAX, OPENING_MINUS_DOOR, DOOR_MINUS_PASSAGE } from './constants'

export type WidthKey = 'OUVERTURE_L' | 'PORTE_L' | 'PASSAGE_L'

export function toNumber(value: string | undefined, fallback?: number): number | undefined {
  if (value == null || value === '') return fallback
  const n = Number((value + '').replace(',', '.'))
  return Number.isFinite(n) ? n : fallback
}

export function clampCouvreJoint(n: number): number {
  if (!Number.isFinite(n)) return CJ_MIN
  return Math.min(CJ_MAX, Math.max(CJ_MIN, n))
}

export function recomputeLinkedWidths(values: Record<string,string>, source: WidthKey): Record<string,string> {
  const next = { ...values }
  const v = toNumber(next[source])
  if (v == null) return next
  
  if (source === 'PORTE_L') {
    next['OUVERTURE_L'] = String(v + OPENING_MINUS_DOOR)
    next['PASSAGE_L'] = String(v - DOOR_MINUS_PASSAGE)
  } else if (source === 'OUVERTURE_L') {
    const door = v - OPENING_MINUS_DOOR
    next['PORTE_L'] = String(door)
    next['PASSAGE_L'] = String(door - DOOR_MINUS_PASSAGE)
  } else if (source === 'PASSAGE_L') {
    const door = v + DOOR_MINUS_PASSAGE
    next['PORTE_L'] = String(door)
    next['OUVERTURE_L'] = String(door + OPENING_MINUS_DOOR)
  }
  
  return next
}
