export type SeriesEntryRow = {
  id: number
  boatId: number
  seriesId: number
}

export const seriesEntries: SeriesEntryRow[] = [
  { id: 1, boatId: 1, seriesId: 1 },
  { id: 2, boatId: 5, seriesId: 1 },
  { id: 3, boatId: 9, seriesId: 1 },
  { id: 4, boatId: 2, seriesId: 2 },
  { id: 5, boatId: 3, seriesId: 2 },
  { id: 6, boatId: 6, seriesId: 3 },
  { id: 7, boatId: 7, seriesId: 3 },
]

export function findSeriesEntryById(id: number): SeriesEntryRow | undefined {
  return seriesEntries.find((row) => row.id === id)
}

