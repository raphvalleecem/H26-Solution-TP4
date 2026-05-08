import axios from 'axios';

export type Race = {
  id: number;
  name: string;
  date: string;
  startTime: string;
  course: string;
  track?: string;
  raceClass?: { id: number; name?: string };
  series?: { id: number; name?: string };
  raceClassId: number;
  seriesId: number;
  isCompleted: boolean;
};

let racesCache: Race[] = [];

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

    racesCache = response.data.map((race) => {
      const startTimeValue = race.startTime ?? '';
      const isIsoDateTime = startTimeValue.includes('T') || startTimeValue.includes(' ');
      const parsedStartTime = isIsoDateTime ? new Date(startTimeValue) : null;
      const resolvedDate = race.date ?? (parsedStartTime ? parsedStartTime.toISOString().split('T')[0]! : '-');
      const resolvedStartTime = parsedStartTime
        ? parsedStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : startTimeValue || '-';

      return {
        id: race.id,
        name: race.name,
        date: resolvedDate,
        startTime: resolvedStartTime,
        course: race.course ?? race.track ?? '-',
        track: race.course ?? race.track ?? '-',
        raceClass: race.raceClass ?? undefined,
        series: race.series ?? undefined,
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

export async function addRace(formData: {
   name: string;
   date: string;
   startTime: string;
   course: string;
   raceClassId: number;
   seriesId: number;
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
