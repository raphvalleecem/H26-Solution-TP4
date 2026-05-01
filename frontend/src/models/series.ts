import axios from 'axios'
import type { RaceClass } from '@/models/raceClass.ts';

export type Series = {
  id: number;
  name: string;
  nbRaces: number;
  nbRacesToCount: number;
  raceClass: RaceClass;
  isCompleted: boolean;
};

export const seriesRows: Series[] = [
  { id: 1, name: 'Serie 1', nbRaces: 2, nbRacesToCount: 2, raceClass: 1, isCompleted: true },
  { id: 2, name: 'Serie 2', nbRaces: 2, nbRacesToCount: 2, raceClass: 2, isCompleted: true },
  { id: 3, name: 'Serie 3', nbRaces: 2, nbRacesToCount: 1, raceClass: 3, isCompleted: false },
  { id: 4, name: 'Serie 4', nbRaces: 2, nbRacesToCount: 1, raceClass: 4, isCompleted: false },
  { id: 5, name: 'Serie 5', nbRaces: 2, nbRacesToCount: 2, raceClass: 5, isCompleted: true },
  { id: 6, name: 'Serie 6', nbRaces: 2, nbRacesToCount: 2, raceClass: 6, isCompleted: false },
  { id: 7, name: 'Serie 7', nbRaces: 2, nbRacesToCount: 1, raceClass: 7, isCompleted: false },
  { id: 8, name: 'Serie 8', nbRaces: 2, nbRacesToCount: 1, raceClass: 8, isCompleted: true },
  { id: 9, name: 'Serie 9', nbRaces: 2, nbRacesToCount: 2, raceClass: 9, isCompleted: false },
  { id: 10, name: 'Serie 10', nbRaces: 2, nbRacesToCount: 2, raceClass: 10, isCompleted: true },
  { id: 11, name: 'Serie 11', nbRaces: 2, nbRacesToCount: 1, raceClass: 11, isCompleted: false },
  { id: 12, name: 'Serie 12', nbRaces: 2, nbRacesToCount: 1, raceClass: 12, isCompleted: false },
];

export async function getSeries(): Promise<Series[]> {
  try {
    const response = await axios.get<Series[]>('http://localhost:3000/series')
    return response.data
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export function findSeriesById(id: number): Series | undefined {
  return seriesRows.find((row) => row.id === id);
}

type SeriesPayload = {
  name: string;
  nbRaces: number;
  nbRacesToCount: number;
  raceClassId: number;
  isCompleted?: boolean;
};

export function addSeries(payload: SeriesPayload): Series {
  const nextId = Math.max(0, ...seriesRows.map((row) => row.id)) + 1;
  const row: Series = {
    id: nextId,
    name: payload.name,
    nbRaces: payload.nbRaces,
    nbRacesToCount: payload.nbRacesToCount,
    raceClass: payload.raceClassId,
    isCompleted: payload.isCompleted ?? false,
  };
  seriesRows.push(row);
  return row;
}

export function updateSeries(id: number, payload: SeriesPayload): boolean {
  const index = seriesRows.findIndex((row) => row.id === id);
  if (index < 0) {
    return false;
  }

  const current = seriesRows[index];
  if (!current) {
    return false;
  }

  seriesRows[index] = {
    id,
    name: payload.name,
    nbRaces: payload.nbRaces,
    nbRacesToCount: payload.nbRacesToCount,
    raceClass: payload.raceClassId,
    isCompleted: payload.isCompleted ?? current.isCompleted,
  };
  return true;
}

export function deleteSeries(id: number): boolean {
  const index = seriesRows.findIndex((row) => row.id === id);
  if (index < 0) {
    return false;
  }

  seriesRows.splice(index, 1);
  return true;
}
