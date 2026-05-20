import axios from 'axios';

export type RaceEntry = {
  id: number;
  boatId: number;
  raceId: number;
  seriesEntryId?: number;
};

let raceEntriesCache: RaceEntry[] = [];

export async function getRaceEntries(): Promise<RaceEntry[]> {
  try {
    const response = await axios.get<RaceEntry[]>('/race-entry');
    raceEntriesCache = response.data;
    return response.data;
  } catch {
    return [];
  }
}

export async function getRaceEntriesByRaceId(raceId: number): Promise<any[]> {
  try {
    const response = await axios.get<any[]>(`/race-entry/${raceId}`);
    // return raw rows (with boat and race objects) so callers can merge boat details
    return response.data;
  } catch {
    return [];
  }
}

export function findRaceEntryById(id: number): RaceEntry | undefined {
  return raceEntriesCache.find((row) => row.id === id);
}

export async function addRaceEntry(payload: Pick<RaceEntry, 'boatId' | 'raceId'>): Promise<RaceEntry | null> {
  try {
    const response = await axios.post<RaceEntry>('/race-entry/create', {
      boatId: payload.boatId,
      raceId: payload.raceId,
    });
    const created = response.data;
    raceEntriesCache = [...raceEntriesCache, created];
    return created;
  } catch {
    return null;
  }
}

export function updateRaceEntry(id: number, payload: Omit<RaceEntry, 'id'>): boolean {
  const index = raceEntriesCache.findIndex((row) => row.id === id);
  if (index < 0) {
    return false;
  }

  raceEntriesCache[index] = { id, ...payload };
  return true;
}

export function deleteRaceEntry(id: number): boolean {
  const index = raceEntriesCache.findIndex((row) => row.id === id);
  if (index < 0) {
    return false;
  }

  raceEntriesCache.splice(index, 1);
  return true;
}
