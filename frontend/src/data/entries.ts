export type RaceEntryRow = {
  id: number
  boatId: number
  raceId: number
}

export const raceEntries: RaceEntryRow[] = [
  { id: 1, boatId: 1, raceId: 1 },
  { id: 2, boatId: 2, raceId: 1 },
  { id: 3, boatId: 1, raceId: 2 },
]

export function findRaceEntryById(id: number): RaceEntryRow | undefined {
  return raceEntries.find((row) => row.id === id)
}

export function addRaceEntry(payload: Omit<RaceEntryRow, 'id'>): RaceEntryRow {
  const nextId = Math.max(0, ...raceEntries.map((row) => row.id)) + 1
  const row: RaceEntryRow = { id: nextId, ...payload }
  raceEntries.push(row)
  return row
}

export function updateRaceEntry(id: number, payload: Omit<RaceEntryRow, 'id'>): boolean {
  const index = raceEntries.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  raceEntries[index] = { id, ...payload }
  return true
}

export function deleteRaceEntry(id: number): boolean {
  const index = raceEntries.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  raceEntries.splice(index, 1)
  return true
}

