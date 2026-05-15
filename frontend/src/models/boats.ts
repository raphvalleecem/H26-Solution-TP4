import axios from 'axios';

export type Boat = {
  id: number;
  name: string;
  sailNumber: number;
  helmName: string;
  boatClassId: number;
};

let boatsCache: Boat[] = [];

export async function getBoats(): Promise<Boat[]> {
  try {
    const response = await axios.get<Boat[]>('http://localhost:3000/boat');
    boatsCache = response.data;
    return response.data;
  } catch {
    return [];
  }
}

export function findBoatById(id: number): Boat | undefined {
  return boatsCache.find((boat) => boat.id === id);
}
