export type Boat = {
  id: number
  name: string
  sailNumber: number
  helmName: string
  boatClassId: number
}

export const boats: Boat[] = [
  { id: 1, name: 'Boat 1', sailNumber: 2001, helmName: 'Helm 1', boatClassId: 1 },
  { id: 2, name: 'Boat 2', sailNumber: 2002, helmName: 'Helm 2', boatClassId: 2 },
  { id: 3, name: 'Boat 3', sailNumber: 2003, helmName: 'Helm 3', boatClassId: 3 },
  { id: 4, name: 'Boat 4', sailNumber: 2004, helmName: 'Helm 4', boatClassId: 4 },
  { id: 5, name: 'Boat 5', sailNumber: 2005, helmName: 'Helm 5', boatClassId: 5 },
  { id: 6, name: 'Boat 6', sailNumber: 2006, helmName: 'Helm 6', boatClassId: 6 },
  { id: 7, name: 'Boat 7', sailNumber: 2007, helmName: 'Helm 7', boatClassId: 7 },
  { id: 8, name: 'Boat 8', sailNumber: 2008, helmName: 'Helm 8', boatClassId: 8 },
  { id: 9, name: 'Boat 9', sailNumber: 2009, helmName: 'Helm 9', boatClassId: 9 },
  { id: 10, name: 'Boat 10', sailNumber: 2010, helmName: 'Helm 10', boatClassId: 10 },
  { id: 11, name: 'Boat 11', sailNumber: 2011, helmName: 'Helm 11', boatClassId: 11 },
  { id: 12, name: 'Boat 12', sailNumber: 2012, helmName: 'Helm 12', boatClassId: 12 },
  { id: 13, name: 'Boat 13', sailNumber: 2013, helmName: 'Helm 13', boatClassId: 1 },
  { id: 14, name: 'Boat 14', sailNumber: 2014, helmName: 'Helm 14', boatClassId: 2 },
  { id: 15, name: 'Boat 15', sailNumber: 2015, helmName: 'Helm 15', boatClassId: 3 },
  { id: 16, name: 'Boat 16', sailNumber: 2016, helmName: 'Helm 16', boatClassId: 4 },
  { id: 17, name: 'Boat 17', sailNumber: 2017, helmName: 'Helm 17', boatClassId: 5 },
  { id: 18, name: 'Boat 18', sailNumber: 2018, helmName: 'Helm 18', boatClassId: 6 },
  { id: 19, name: 'Boat 19', sailNumber: 2019, helmName: 'Helm 19', boatClassId: 7 },
  { id: 20, name: 'Boat 20', sailNumber: 2020, helmName: 'Helm 20', boatClassId: 8 },
  { id: 21, name: 'Boat 21', sailNumber: 2021, helmName: 'Helm 21', boatClassId: 9 },
  { id: 22, name: 'Boat 22', sailNumber: 2022, helmName: 'Helm 22', boatClassId: 10 },
  { id: 23, name: 'Boat 23', sailNumber: 2023, helmName: 'Helm 23', boatClassId: 11 },
  { id: 24, name: 'Boat 24', sailNumber: 2024, helmName: 'Helm 24', boatClassId: 12 },
  { id: 25, name: 'Boat 25', sailNumber: 2025, helmName: 'Helm 25', boatClassId: 1 },
  { id: 26, name: 'Boat 26', sailNumber: 2026, helmName: 'Helm 26', boatClassId: 2 },
  { id: 27, name: 'Boat 27', sailNumber: 2027, helmName: 'Helm 27', boatClassId: 3 },
  { id: 28, name: 'Boat 28', sailNumber: 2028, helmName: 'Helm 28', boatClassId: 4 },
  { id: 29, name: 'Boat 29', sailNumber: 2029, helmName: 'Helm 29', boatClassId: 5 },
  { id: 30, name: 'Boat 30', sailNumber: 2030, helmName: 'Helm 30', boatClassId: 6 },
]

export function findBoatById(id: number): Boat | undefined {
  return boats.find((boat) => boat.id === id)
}
