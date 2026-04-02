export type RaceRow = {
  id: number
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
  seriesId: number
  isCompleted: boolean
}

export const races: RaceRow[] = [
  { id: 1, name: 'Race 1', date: '2026-04-05', startTime: '09:00', course: 'Triangle', raceClassId: 1, seriesId: 1, isCompleted: true },
  { id: 2, name: 'Race 2', date: '2026-04-12', startTime: '09:30', course: 'Banane', raceClassId: 1, seriesId: 1, isCompleted: true },
  { id: 3, name: 'Race 3', date: '2026-04-19', startTime: '10:00', course: 'W', raceClassId: 2, seriesId: 2, isCompleted: true },
  { id: 4, name: 'Race 4', date: '2026-04-26', startTime: '13:00', course: 'Cotiers', raceClassId: 2, seriesId: 2, isCompleted: false },
  { id: 5, name: 'Race 5', date: '2026-05-03', startTime: '09:10', course: 'Triangle', raceClassId: 3, seriesId: 3, isCompleted: false },
  { id: 6, name: 'Race 6', date: '2026-05-10', startTime: '09:40', course: 'Parcours libre', raceClassId: 3, seriesId: 3, isCompleted: false },
  { id: 7, name: 'Race 7', date: '2026-05-17', startTime: '10:10', course: 'Banane longue', raceClassId: 4, seriesId: 4, isCompleted: false },
  { id: 8, name: 'Race 8', date: '2026-05-24', startTime: '13:20', course: 'W', raceClassId: 4, seriesId: 4, isCompleted: false },
  { id: 9, name: 'Race 9', date: '2026-05-31', startTime: '09:05', course: 'Triangle', raceClassId: 5, seriesId: 5, isCompleted: true },
  { id: 10, name: 'Race 10', date: '2026-06-07', startTime: '09:35', course: 'Banane', raceClassId: 5, seriesId: 5, isCompleted: true },
  { id: 11, name: 'Race 11', date: '2026-06-14', startTime: '10:05', course: 'Cotiers', raceClassId: 6, seriesId: 6, isCompleted: false },
  { id: 12, name: 'Race 12', date: '2026-06-21', startTime: '13:15', course: 'Parcours libre', raceClassId: 6, seriesId: 6, isCompleted: false },
  { id: 13, name: 'Race 13', date: '2026-06-28', startTime: '09:15', course: 'Triangle', raceClassId: 7, seriesId: 7, isCompleted: false },
  { id: 14, name: 'Race 14', date: '2026-07-05', startTime: '09:45', course: 'Banane', raceClassId: 7, seriesId: 7, isCompleted: false },
  { id: 15, name: 'Race 15', date: '2026-07-12', startTime: '10:15', course: 'W', raceClassId: 8, seriesId: 8, isCompleted: true },
  { id: 16, name: 'Race 16', date: '2026-07-19', startTime: '13:25', course: 'Cotiers', raceClassId: 8, seriesId: 8, isCompleted: true },
  { id: 17, name: 'Race 17', date: '2026-07-26', startTime: '09:20', course: 'Triangle', raceClassId: 9, seriesId: 9, isCompleted: false },
  { id: 18, name: 'Race 18', date: '2026-08-02', startTime: '09:50', course: 'Banane longue', raceClassId: 9, seriesId: 9, isCompleted: false },
  { id: 19, name: 'Race 19', date: '2026-08-09', startTime: '10:20', course: 'Parcours libre', raceClassId: 10, seriesId: 10, isCompleted: true },
  { id: 20, name: 'Race 20', date: '2026-08-16', startTime: '13:30', course: 'W', raceClassId: 10, seriesId: 10, isCompleted: true },
  { id: 21, name: 'Race 21', date: '2026-08-23', startTime: '09:25', course: 'Triangle', raceClassId: 11, seriesId: 11, isCompleted: false },
  { id: 22, name: 'Race 22', date: '2026-08-30', startTime: '09:55', course: 'Banane', raceClassId: 11, seriesId: 11, isCompleted: false },
  { id: 23, name: 'Race 23', date: '2026-09-06', startTime: '10:25', course: 'Cotiers', raceClassId: 12, seriesId: 12, isCompleted: false },
  { id: 24, name: 'Race 24', date: '2026-09-13', startTime: '13:35', course: 'Parcours libre', raceClassId: 12, seriesId: 12, isCompleted: false },
]

export function findRaceById(id: number): RaceRow | undefined {
  return races.find((row) => row.id === id)
}

type RacePayload = {
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
  seriesId?: number
  isCompleted?: boolean
}

export function addRace(payload: RacePayload): RaceRow {
  const nextId = Math.max(0, ...races.map((row) => row.id)) + 1
  const row: RaceRow = {
    id: nextId,
    name: payload.name,
    date: payload.date,
    startTime: payload.startTime,
    course: payload.course,
    raceClassId: payload.raceClassId,
    seriesId: payload.seriesId ?? 1,
    isCompleted: payload.isCompleted ?? false,
  }
  races.push(row)
  return row
}

export function updateRace(id: number, payload: RacePayload): boolean {
  const index = races.findIndex((row) => row.id === id)
  if (index < 0) {
    return false
  }

  const current = races[index]
  if (!current) {
    return false
  }

  races[index] = {
    id,
    name: payload.name,
    date: payload.date,
    startTime: payload.startTime,
    course: payload.course,
    raceClassId: payload.raceClassId,
    seriesId: payload.seriesId ?? current.seriesId,
    isCompleted: payload.isCompleted ?? current.isCompleted,
  }
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
