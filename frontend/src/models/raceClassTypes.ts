export type RaceClassType = {
  id: number
  name: 'monotype' | 'handicap'
}

export const raceClassTypes: RaceClassType[] = [
  { id: 1, name: 'monotype' },
  { id: 2, name: 'handicap' },
]

export function findRaceClassTypeById(id: number): RaceClassType | undefined {
  return raceClassTypes.find((row) => row.id === id)
}
