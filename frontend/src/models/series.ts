import axios from 'axios';
import type { RaceClass } from '@/models/raceClass.ts';

export type Series = {
  id: number;
  name: string;
  nbRaces: number;
  nbRacesToCount: number;
  isCompleted: boolean;
  raceClass: RaceClass;
};

let seriesCache: Series[] = [];

export async function getSeries(): Promise<Series[]> {
  try {
    const response = await axios.get<Series[]>('http://localhost:3000/series');
    seriesCache = response.data;
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export function findSeriesById(id: number): Series | undefined {
  return seriesCache.find((series) => series.id === id);
}

export async function getSeriesById(id: number): Promise<Series | undefined> {
  try {
    const response = await axios.get<Series>(`http://localhost:3000/series/${id}`);
    const series = response.data;
    seriesCache = seriesCache.some((item) => item.id === series.id)
      ? seriesCache.map((item) => (item.id === series.id ? series : item))
      : [...seriesCache, series];
    return series;
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
}

export async function addSeries(payload: Omit<Series, 'id'>): Promise<void> {
  try {
    const response = await axios.post('http://localhost:3000/series/create', payload);
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
