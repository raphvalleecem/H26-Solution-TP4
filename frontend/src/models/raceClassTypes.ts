import axios from 'axios';

export type RaceClassType = {
  id: number;
  name: string;
};

export async function getRaceClassTypes(): Promise<RaceClassType[]> {
  try {
    const response = await axios.get<RaceClassType[]>('http://localhost:3000/race-class-type');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
