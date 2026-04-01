export type SeriesRow = {
  id: number
  name: string
  nbRaces: number
  nbRacesToCount: number
  raceClassId: number
}

export const seriesRows: SeriesRow[] = [
  { id: 1, name: 'Serie Printemps', nbRaces: 8, nbRacesToCount: 6, raceClassId: 1 },
  { id: 2, name: 'Serie Estivale', nbRaces: 10, nbRacesToCount: 7, raceClassId: 2 },
  { id: 3, name: 'Championat IRC', nbRaces: 6, nbRacesToCount: 5, raceClassId: 3 },
]

export function findSeriesById(id: number): SeriesRow | undefined {
  return seriesRows.find((row) => row.id === id)
}

export function addSeries(payload: Omit<SeriesRow, 'id'>): SeriesRow {
  const nextId = Math.max(0, ...seriesRows.map((row) => row.id)) + 1
  const row: SeriesRow = { id: nextId, ...payload }
  seriesRows.push(row)
  return row
}

export function updateSeries(id: number, payload: Omit<SeriesRow, 'id'>): boolean {
  const index = seriesRows.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  seriesRows[index] = { id, ...payload }
  return true
}

export function deleteSeries(id: number): boolean {
  const index = seriesRows.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  seriesRows.splice(index, 1)
  return true
}

