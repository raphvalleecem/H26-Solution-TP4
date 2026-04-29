import axios from 'axios'

export type Race = {
  id: number
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
  seriesId?: number
  isCompleted: boolean
}

export async function getRaces(): Promise<Race[]> {
  try {
    const response = await axios.get<Race[]>('http://localhost:3000/races')
    return response.data.map((race) => {
      const startDateTime = race.startTime ? new Date(race.startTime) : null
      return {
        id: race.id,
        name: race.name,
        date: startDateTime ? startDateTime.toISOString().split('T')[0]! : '-',
        startTime: startDateTime
          ? startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '-',
        course: race.course,
        raceClassId: race.raceClassId ?? 0,
        seriesId: race.seriesId ?? 0,
        isCompleted: !!race.isCompleted,
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export async function addRace(
  formData: Omit<Race, 'id' | 'seriesId'> & { seriesId?: number },
): Promise<void> {
  try {
    const response = await axios.post('http://localhost:3000/race/create', formData)
    console.log('Success:', response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}
