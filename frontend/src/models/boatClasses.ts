export type BoatClass = {
  id: number;
  name: string;
  handicapValue: number;
  handicapTypeId: number;
};

export const boatClasses: BoatClass[] = [
  { id: 1, name: 'Boat class 1', handicapValue: 1110, handicapTypeId: 1 },
  { id: 2, name: 'Boat class 2', handicapValue: 1115, handicapTypeId: 1 },
  { id: 3, name: 'Boat class 3', handicapValue: 0.99, handicapTypeId: 2 },
  { id: 4, name: 'Boat class 4', handicapValue: 1.02, handicapTypeId: 2 },
  { id: 5, name: 'Boat class 5', handicapValue: 1060, handicapTypeId: 1 },
  { id: 6, name: 'Boat class 6', handicapValue: 1640, handicapTypeId: 1 },
  { id: 7, name: 'Boat class 7', handicapValue: 1095, handicapTypeId: 1 },
  { id: 8, name: 'Boat class 8', handicapValue: 1.05, handicapTypeId: 2 },
  { id: 9, name: 'Boat class 9', handicapValue: 1135, handicapTypeId: 1 },
  { id: 10, name: 'Boat class 10', handicapValue: 0.97, handicapTypeId: 2 },
  { id: 11, name: 'Boat class 11', handicapValue: 1185, handicapTypeId: 1 },
  { id: 12, name: 'Boat class 12', handicapValue: 1.08, handicapTypeId: 2 },
];

export function findBoatClassById(id: number): BoatClass | undefined {
  return boatClasses.find((row) => row.id === id);
}
