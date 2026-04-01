export type RaceClassRow = {
  id: number
  name: string
  minHandicap: number
  maxHandicap: number
  handicapTypeId: number
  raceClassTypeId: number
}

export const handicapTypes = [
  { id: 1, name: 'PYN' },
  { id: 2, name: 'IRC' },
  { id: 3, name: 'ORC' },
]

export const raceClassTypes = [
  { id: 1, name: 'Monocoque' },
  { id: 2, name: 'Multicoque' },
  { id: 3, name: 'Deriveur' },
]

export const raceClasses: RaceClassRow[] = [
  { id: 1, name: 'Club A', minHandicap: 850, maxHandicap: 980, handicapTypeId: 1, raceClassTypeId: 1 },
  { id: 2, name: 'Club B', minHandicap: 981, maxHandicap: 1100, handicapTypeId: 1, raceClassTypeId: 1 },
  { id: 3, name: 'Performance', minHandicap: 0.88, maxHandicap: 1.2, handicapTypeId: 2, raceClassTypeId: 2, },
]

export function findRaceClassById(id: number): RaceClassRow | undefined {
  return raceClasses.find((row) => row.id === id)
}

export function addRaceClass(payload: Omit<RaceClassRow, 'id'>): RaceClassRow {
  const nextId = Math.max(0, ...raceClasses.map((row) => row.id)) + 1
  const row: RaceClassRow = { id: nextId, ...payload }
  raceClasses.push(row)
  return row
}

export function updateRaceClass(id: number, payload: Omit<RaceClassRow, 'id'>): boolean {
  const index = raceClasses.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  raceClasses[index] = { id, ...payload }
  return true
}

export function deleteRaceClass(id: number): boolean {
  const index = raceClasses.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  raceClasses.splice(index, 1)
  return true
}

