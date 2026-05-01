import type { HandicapType } from '@/models/handicapTypes.ts';

export type BoatClass = {
  id: number;
  name: string;
  handicapValue: number;
  handicapType: HandicapType;
};
