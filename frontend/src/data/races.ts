export type RaceRow = {
  id: number
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
}

export const races: RaceRow[] = [
  { id: 1, name: 'Regate du matin', date: '2026-05-12', startTime: '09:00', course: 'Triangle', raceClassId: 1 },
  { id: 2, name: 'Coupe du vent', date: '2026-05-12', startTime: '13:30', course: 'Banane', raceClassId: 2 },
  { id: 3, name: 'Nocturne', date: '2026-06-02', startTime: '18:45', course: 'Parcours libre', raceClassId: 3 },
]

export function findRaceById(id: number): RaceRow | undefined {
  return races.find((row) => row.id === id)
}

export function addRace(payload: Omit<RaceRow, 'id'>): RaceRow {
  const nextId = Math.max(0, ...races.map((row) => row.id)) + 1
  const row: RaceRow = { id: nextId, ...payload }
  races.push(row)
  return row
}

export function updateRace(id: number, payload: Omit<RaceRow, 'id'>): boolean {
  const index = races.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  races[index] = { id, ...payload }
  return true
}

export function deleteRace(id: number): boolean {
  const index = races.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  races.splice(index, 1)
  return true
}

