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

export async function addRace(formData: RaceCreatePayload): Promise<void> {
  try {
    const response = await axios.post('http://localhost:3000/race/create', formData);
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
