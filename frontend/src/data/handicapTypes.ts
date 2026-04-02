export type HandicapTypeRow = {
  id: number
  name: 'PY' | 'TMF'
}

export const handicapTypes: HandicapTypeRow[] = [
  { id: 1, name: 'PY' },
  { id: 2, name: 'TMF' },
]

export function findHandicapTypeById(id: number): HandicapTypeRow | undefined {
  return handicapTypes.find((row) => row.id === id)
}

