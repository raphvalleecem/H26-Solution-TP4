import axios from 'axios';

export type HandicapType = {
  id: number;
  name: string;
};

export async function getHandicapTypes(): Promise<HandicapType[]> {
  try {
    const response = await axios.get<HandicapType[]>('http://localhost:3000/handicap-type');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
