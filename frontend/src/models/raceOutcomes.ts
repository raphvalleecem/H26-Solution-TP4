export type RaceOutcomeResult = 'DNS' | 'OCS' | 'DNF' | 'RTD' | 'DSQ' | ''

export type RaceOutcome = {
  id: number
  result: RaceOutcomeResult
  position?: number
  finishTime?: string
  elapsedTime?: number
  correctedTime?: number
  raceEntryId: number
}

export const raceOutcomes: RaceOutcome[] = [
  {
    id: 1,
    result: '',
    position: 1,
    finishTime: '2026-05-02T10:52:00',
    elapsedTime: 3120,
    correctedTime: 3012,
    raceEntryId: 1,
  },
  {
    id: 2,
    result: 'DNF',
    raceEntryId: 2,
  },
  {
    id: 3,
    result: '',
    position: 2,
    finishTime: '2026-05-02T10:58:00',
    elapsedTime: 3480,
    correctedTime: 3360,
    raceEntryId: 3,
  },
  {
    id: 4,
    result: '',
    position: 1,
    finishTime: '2026-09-10T19:45:00',
    elapsedTime: 3900,
    correctedTime: 3960,
    raceEntryId: 8,
  },
]

export function findRaceOutcomeByEntryId(raceEntryId: number): RaceOutcome | undefined {
  return raceOutcomes.find((row) => row.raceEntryId === raceEntryId)
}
