export type RaceEntry = {
  id: number
  boatId: number
  raceId: number
  seriesEntryId?: number
}

export const raceEntries: RaceEntry[] = [
  { id: 1, boatId: 1, raceId: 1, seriesEntryId: 1 },
  { id: 2, boatId: 5, raceId: 1, seriesEntryId: 2 },
  { id: 3, boatId: 9, raceId: 1, seriesEntryId: 3 },
  { id: 4, boatId: 1, raceId: 2, seriesEntryId: 1 },
  { id: 5, boatId: 5, raceId: 2, seriesEntryId: 2 },
  { id: 6, boatId: 2, raceId: 4, seriesEntryId: 4 },
  { id: 7, boatId: 3, raceId: 4, seriesEntryId: 5 },
  { id: 8, boatId: 6, raceId: 6, seriesEntryId: 6 },
]

export function findRaceEntryById(id: number): RaceEntry | undefined {
  return raceEntries.find((row) => row.id === id)
}

export function addRaceEntry(payload: Omit<RaceEntry, 'id'>): RaceEntry {
  const nextId = Math.max(0, ...raceEntries.map((row) => row.id)) + 1
  const row: RaceEntry = { id: nextId, ...payload }
  raceEntries.push(row)
  return row
}

export function updateRaceEntry(id: number, payload: Omit<RaceEntry, 'id'>): boolean {
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
