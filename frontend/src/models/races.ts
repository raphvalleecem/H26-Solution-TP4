import axios from 'axios';
import type { RaceClass } from '@/models/raceClass.ts';
import type { Series } from '@/models/series.ts';

export type Race = {
  id: number;
  name: string;
  // both `startDate` and `date` are used in different places; keep both optional
  startDate?: string;
  date?: string;
  startTime: string;
  // both `track` and `course` are used; keep both optional
  track?: string;
  course?: string;
  isCompleted: boolean;
  raceClass?: RaceClass;
  series?: Series;
  raceClassId?: number;
  seriesId?: number;
};

export type RaceCreatePayload = {
  name: string;
  startDate: string;
  startTime: string;
  track: string;
  raceClassId: number;
  seriesId: number | null;
};

// In-memory cache for races list used by getters. Initialized empty.
// Exported so other modules (and runtime) can reference it for debugging if needed.
export let racesCache: Race[] = [];

export async function getRaces(): Promise<Race[]> {
  try {
    type RaceApiRow = Race & {
      track?: string;
      date?: string;
      raceClassId?: number;
      seriesId?: number;
      raceClass?: { id: number; name?: string } | null;
      series?: { id: number; name?: string } | null;
    };

    const response = await axios.get<RaceApiRow[]>('http://localhost:3000/race');

    // use any for runtime data from backend to avoid strict typing issues
    racesCache = response.data.map((race: any) => {
      // backend may return date/time in different fields: `date`, `startDate`, or `startTime`.
      // Prefer explicit date fields, then fall back to parsing any ISO datetime available.
      const rawDateCandidate = race.date ?? race.startDate ?? race.startTime ?? '';
      const rawTimeCandidate = race.startTime ?? '';

      const isIsoDateTime = rawDateCandidate.includes('T') || rawDateCandidate.includes(' ');

      // If we received an ISO datetime string, extract date and time components directly
      // instead of using Date (to avoid timezone conversions).
      let resolvedDate: string;
      let resolvedStartTime: string;

      if (isIsoDateTime) {
        const parts = rawDateCandidate.split('T');
        resolvedDate = parts[0] ?? '-';
        const timePart = (parts[1] ?? rawTimeCandidate).split('.')[0] ?? '';
        // normalize to HH:mm or HH:mm:ss -> prefer HH:mm
        const hhmm = timePart.split(':').slice(0, 2).join(':');
        resolvedStartTime = hhmm || (timePart ? timePart : '-');
      } else {
        resolvedDate = race.date ?? race.startDate ?? '-';
        resolvedStartTime = rawTimeCandidate || '-';
      }

      return {
        id: race.id,
        name: race.name,
        // provide both `date` and `startDate` fields since different views expect different names
        date: resolvedDate,
        startDate: resolvedDate,
        startTime: resolvedStartTime,
        course: race.course ?? race.track ?? '-',
        track: race.course ?? race.track ?? '-',
        raceClass: race.raceClass ?? undefined,
        // DataTables expects `series` column to be the series id (number). Provide id, not object.
        series: race.seriesId ?? race.series?.id ?? 0,
        raceClassId: race.raceClassId ?? race.raceClass?.id ?? 0,
        seriesId: race.seriesId ?? race.series?.id ?? 0,
        isCompleted: !!race.isCompleted,
      };
    });
    return racesCache;
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
    const race: any = response.data;

    // Handle different backend field names: `date`, `startDate`, `startTime`.
    const rawDateCandidate = (race as any).date ?? (race as any).startDate ?? (race as any).startTime ?? '';
    const rawTimeCandidate = (race as any).startTime ?? '';

    const isIsoDateTime = rawDateCandidate.includes('T') || rawDateCandidate.includes(' ');

    let normalizedDate: string;
    let normalizedStartTime: string;
    if (isIsoDateTime) {
      const parts = rawDateCandidate.split('T');
      normalizedDate = parts[0] ?? '-';
      const timePart = (parts[1] ?? rawTimeCandidate).split('.')[0] ?? '';
      normalizedStartTime = timePart.split(':').slice(0, 2).join(':') || (timePart ? timePart : '-');
    } else {
      normalizedDate = (race as any).date ?? (race as any).startDate ?? '-';
      normalizedStartTime = rawTimeCandidate || '-';
    }

    const normalizedRace: Race = {
      ...race,
      date: normalizedDate,
      startDate: normalizedDate,
      startTime: normalizedStartTime,
      course: (race as any).course ?? (race as any).track ?? '-',
      track: (race as any).course ?? (race as any).track ?? '-',
      raceClass: (race as any).raceClass ?? undefined,
      // expose series as id for the table column (not the full object)
      series: (race as any).seriesId ?? (race as any).series?.id ?? 0,
      raceClassId: (race as any).raceClassId ?? (race as any).raceClass?.id ?? 0,
      seriesId: (race as any).seriesId ?? (race as any).series?.id ?? 0,
      isCompleted: !!(race as any).isCompleted,
    };

    racesCache = racesCache.some((item: Race) => item.id === normalizedRace.id)
      ? racesCache.map((item: Race) => (item.id === normalizedRace.id ? normalizedRace : item))
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

export async function updateRace(id: number, formData: FormData): Promise<void> {
  try {
    const response = await axios.post('/race/update', formData);
    console.log('Success:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Failed to update race');
    }
    console.error('Error:', error);
    throw error;
  }
}
