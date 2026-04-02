export type RaceClassTypeRow = {
  id: number
  name: 'monotype' | 'handicap'
}

export const raceClassTypes: RaceClassTypeRow[] = [
  { id: 1, name: 'monotype' },
  { id: 2, name: 'handicap' },
]

export function findRaceClassTypeById(id: number): RaceClassTypeRow | undefined {
  return raceClassTypes.find((row) => row.id === id)
}

