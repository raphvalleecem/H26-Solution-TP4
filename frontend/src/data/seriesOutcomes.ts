export type SeriesOutcomeRow = {
  id: number
  totalPoints: number
  position: number
  seriesEntryId: number
}

export const seriesOutcomes: SeriesOutcomeRow[] = [
  { id: 1, totalPoints: 8, position: 1, seriesEntryId: 1 },
  { id: 2, totalPoints: 13, position: 2, seriesEntryId: 2 },
  { id: 3, totalPoints: 19, position: 3, seriesEntryId: 3 },
  { id: 4, totalPoints: 9, position: 1, seriesEntryId: 6 },
  { id: 5, totalPoints: 12, position: 2, seriesEntryId: 7 },
]

export function findSeriesOutcomeByEntryId(seriesEntryId: number): SeriesOutcomeRow | undefined {
  return seriesOutcomes.find((row) => row.seriesEntryId === seriesEntryId)
}

