export type SeriesRow = {
  id: number
  name: string
  nbRaces: number
  nbRacesToCount: number
  raceClassId: number
  isCompleted: boolean
}

export const seriesRows: SeriesRow[] = [
  { id: 1, name: 'Serie 1', nbRaces: 2, nbRacesToCount: 2, raceClassId: 1, isCompleted: true },
  { id: 2, name: 'Serie 2', nbRaces: 2, nbRacesToCount: 2, raceClassId: 2, isCompleted: true },
  { id: 3, name: 'Serie 3', nbRaces: 2, nbRacesToCount: 1, raceClassId: 3, isCompleted: false },
  { id: 4, name: 'Serie 4', nbRaces: 2, nbRacesToCount: 1, raceClassId: 4, isCompleted: false },
  { id: 5, name: 'Serie 5', nbRaces: 2, nbRacesToCount: 2, raceClassId: 5, isCompleted: true },
  { id: 6, name: 'Serie 6', nbRaces: 2, nbRacesToCount: 2, raceClassId: 6, isCompleted: false },
  { id: 7, name: 'Serie 7', nbRaces: 2, nbRacesToCount: 1, raceClassId: 7, isCompleted: false },
  { id: 8, name: 'Serie 8', nbRaces: 2, nbRacesToCount: 1, raceClassId: 8, isCompleted: true },
  { id: 9, name: 'Serie 9', nbRaces: 2, nbRacesToCount: 2, raceClassId: 9, isCompleted: false },
  { id: 10, name: 'Serie 10', nbRaces: 2, nbRacesToCount: 2, raceClassId: 10, isCompleted: true },
  { id: 11, name: 'Serie 11', nbRaces: 2, nbRacesToCount: 1, raceClassId: 11, isCompleted: false },
  { id: 12, name: 'Serie 12', nbRaces: 2, nbRacesToCount: 1, raceClassId: 12, isCompleted: false },
]

export async function getSeries(): Promise<any[]> {
  // try {
  //   const response = await axios.get<SeriesRow[]>('http://localhost:3000/series')
  //   return response.data
  // } catch (error) {
  //   console.error('Error:', error)
  //   return []
  // }
  return [{ id: 1, name: 'SerieTest' }]
}

export function findSeriesById(id: number): SeriesRow | undefined {
  return seriesRows.find((row) => row.id === id)
}

type SeriesPayload = {
  name: string
  nbRaces: number
  nbRacesToCount: number
  raceClassId: number
  isCompleted?: boolean
}

export function addSeries(payload: SeriesPayload): SeriesRow {
  const nextId = Math.max(0, ...seriesRows.map((row) => row.id)) + 1
  const row: SeriesRow = {
    id: nextId,
    name: payload.name,
    nbRaces: payload.nbRaces,
    nbRacesToCount: payload.nbRacesToCount,
    raceClassId: payload.raceClassId,
    isCompleted: payload.isCompleted ?? false,
  }
  seriesRows.push(row)
  return row
}

export function updateSeries(id: number, payload: SeriesPayload): boolean {
  const index = seriesRows.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  const current = seriesRows[index]
  if (!current) {
    return false
  }

  seriesRows[index] = {
    id,
    name: payload.name,
    nbRaces: payload.nbRaces,
    nbRacesToCount: payload.nbRacesToCount,
    raceClassId: payload.raceClassId,
    isCompleted: payload.isCompleted ?? current.isCompleted,
  }
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
