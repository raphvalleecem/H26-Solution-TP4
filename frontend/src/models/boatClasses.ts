export type BoatClass = {
  id: number
  name: string
  handicapValue: number
  handicapTypeId: number
}

export const boatClasses: BoatClass[] = []

export function findBoatClassById(id: number): BoatClass | undefined {
  return boatClasses.find((row) => row.id === id)
}
