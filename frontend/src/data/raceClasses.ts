export type RaceClassRow = {
  id: number
  name: string
  minHandicap?: number
  maxHandicap?: number
  handicapTypeId?: number
  raceClassTypeId: number
  boatClassId?: number
}

export const raceClasses: RaceClassRow[] = [
  { id: 1, name: 'Race class 1', raceClassTypeId: 1, boatClassId: 1 },
  { id: 2, name: 'Race class 2', raceClassTypeId: 1, boatClassId: 2 },
  { id: 3, name: 'Race class 3', raceClassTypeId: 1, boatClassId: 3 },
  { id: 4, name: 'Race class 4', raceClassTypeId: 1, boatClassId: 4 },
  { id: 5, name: 'Race class 5', raceClassTypeId: 1, boatClassId: 5 },
  { id: 6, name: 'Race class 6', raceClassTypeId: 1, boatClassId: 6 },
  {
    id: 7,
    name: 'Race class 7',
    minHandicap: 980,
    maxHandicap: 1250,
    handicapTypeId: 1,
    raceClassTypeId: 2,
  },
  {
    id: 8,
    name: 'Race class 8',
    minHandicap: 0.92,
    maxHandicap: 1.1,
    handicapTypeId: 2,
    raceClassTypeId: 2,
  },
  {
    id: 9,
    name: 'Race class 9',
    minHandicap: 1000,
    maxHandicap: 1300,
    handicapTypeId: 1,
    raceClassTypeId: 2,
  },
  {
    id: 10,
    name: 'Race class 10',
    minHandicap: 0.95,
    maxHandicap: 1.15,
    handicapTypeId: 2,
    raceClassTypeId: 2,
  },
  {
    id: 11,
    name: 'Race class 11',
    minHandicap: 1025,
    maxHandicap: 1350,
    handicapTypeId: 1,
    raceClassTypeId: 2,
  },
  {
    id: 12,
    name: 'Race class 12',
    minHandicap: 0.9,
    maxHandicap: 1.2,
    handicapTypeId: 2,
    raceClassTypeId: 2,
  },
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
