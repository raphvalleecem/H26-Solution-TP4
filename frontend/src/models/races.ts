import axios from 'axios';
import type { RaceClass } from '@/models/raceClass.ts';
import type { Series } from '@/models/series.ts';

export type Race = {
  id: number;
  name: string;
  startDate: string;
  startTime: string;
  track: string;
  isCompleted: boolean;
  raceClass: RaceClass;
  series: Series;
};

export type RaceCreatePayload = {
  name: string;
  startDate: string;
  startTime: string;
  track: string;
  raceClassId: number;
  seriesId: number | null;
};

export async function getRaces(): Promise<Race[]> {
  try {
    const response = await axios.get<Race[]>('http://localhost:3000/race');
    // The API now returns startDate and startTime as strings.
    // Preserve those values directly instead of reconstructing Date objects.
    return response.data.map((race) => ({
      id: race.id,
      name: race.name,
      startDate: race.startDate,
      startTime: race.startTime,
      track: race.track,
      isCompleted: !!race.isCompleted,
      // keep nested raceClass and series objects as provided by the API
      raceClass: race.raceClass,
      series: race.series,
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export function findRaceById(id: number): Race | undefined {
  return racesCache.find((race) => race.id === id);
}

export async function getRaceById(id: number): Promise<Race | undefined> {
  try {
    const response = await axios.get<Race>(`http://localhost:3000/race/${id}`);
    const race = response.data;
    const normalizedStartTime = race.startTime ?? '';
    const isIsoDateTime = normalizedStartTime.includes('T') || normalizedStartTime.includes(' ');
    const parsedStartTime = isIsoDateTime ? new Date(normalizedStartTime) : null;

    const normalizedRace: Race = {
      ...race,
      date: race.date ?? (parsedStartTime ? parsedStartTime.toISOString().split('T')[0]! : '-'),
      startTime: parsedStartTime
        ? parsedStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : normalizedStartTime || '-',
      course: race.course ?? race.track ?? '-',
      track: race.course ?? race.track ?? '-',
      raceClass: race.raceClass ?? undefined,
      series: race.series ?? undefined,
      raceClassId: race.raceClassId ?? race.raceClass?.id ?? 0,
      seriesId: race.seriesId ?? race.series?.id ?? 0,
      isCompleted: !!race.isCompleted,
    };

    racesCache = racesCache.some((item) => item.id === normalizedRace.id)
      ? racesCache.map((item) => (item.id === normalizedRace.id ? normalizedRace : item))
      : [...racesCache, normalizedRace];

    return normalizedRace;
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
}

export async function addRace(formData: {
   name: string;
   date: string;
   startTime: string;
   course: string;
   raceClassId: number;
   seriesId?: number;
   isCompleted: boolean;
 }): Promise<void> {
   try {
     const response = await axios.post('http://localhost:3000/race/create', formData);
     console.log('Success:', response.data);
   } catch (error) {
     if (axios.isAxiosError(error)) {
       console.error('API Error:', error.response?.data || error.message);
       throw new Error(error.response?.data?.error || error.message || 'Failed to create race');
     }
     console.error('Error:', error);
     throw error;
   }
 }
