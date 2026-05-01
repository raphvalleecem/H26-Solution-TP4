import axios from 'axios';
import type { HandicapType } from '@/models/handicapTypes.ts';
import type { RaceClassType } from '@/models/raceClassTypes.ts';

export type RaceClass = {
  id: number;
  name: string;
  minHandicap: number;
  maxHandicap: number;
  handicapType: HandicapType;
  raceClassType: RaceClassType;
};

export async function getRaceClasses(): Promise<RaceClass[]> {
  try {
    const response = await axios.get<RaceClass[]>('http://localhost:3000/race-class');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function addRaceClass(payload: Omit<RaceClass, 'id'>): Promise<void> {
  try {
    const response = await axios.post('http://localhost:3000/race-class/create', payload);
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
