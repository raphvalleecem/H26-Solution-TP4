export type HandicapType = {
  id: number
  name: 'PY' | 'TMF'
}

export const handicapTypes: HandicapType[] = [
  { id: 1, name: 'PY' },
  { id: 2, name: 'TMF' },
]

export function findHandicapTypeById(id: number): HandicapType | undefined {
  return handicapTypes.find((row) => row.id === id)
}
