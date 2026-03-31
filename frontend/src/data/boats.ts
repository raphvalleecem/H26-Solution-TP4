export type BoatRow = {
  id: number
  nom: string
  classe: string
  numeroVoile: string
  barreur: string
}

export const boats: BoatRow[] = [
  { id: 1, nom: 'Aurore', classe: 'Laser', numeroVoile: 'QC-1042', barreur: 'Yohan Tremblay' },
  { id: 2, nom: 'Vent du Nord', classe: '470', numeroVoile: 'QC-2287', barreur: "Mhamma-D'Aout Doursaille" },
  { id: 3, nom: 'Ecume Bleue', classe: 'Finn', numeroVoile: 'QC-3310', barreur: 'Raphaelle Valle' },
  { id: 4, nom: 'Horizon', classe: 'J/24', numeroVoile: 'QC-4475', barreur: 'Eloi Foley' },
  { id: 5, nom: 'Nereide', classe: 'Optimist', numeroVoile: 'QC-5098', barreur: 'Lea Fortin' },
  { id: 6, nom: 'Mistral', classe: 'Catamaran', numeroVoile: 'QC-6124', barreur: 'Antoine Desrosiers' },
  { id: 7, nom: 'Alize', classe: 'ILCA 7', numeroVoile: 'QC-7031', barreur: 'Noah Bouchard' },
  { id: 8, nom: 'Boreal', classe: '29er', numeroVoile: 'QC-8199', barreur: 'Emma Cote' },
  { id: 9, nom: 'Ondine', classe: '420', numeroVoile: 'QC-9051', barreur: 'Liam Gagnon' },
  { id: 10, nom: 'Grand Large', classe: 'J/22', numeroVoile: 'QC-9184', barreur: 'Mila Roy' },
  { id: 11, nom: 'Cap Horn', classe: 'Star', numeroVoile: 'QC-9220', barreur: 'Nathan Dube' },
  { id: 12, nom: 'Sirocco', classe: '420', numeroVoile: 'QC-9343', barreur: 'Sarah Nadeau' },
  { id: 13, nom: 'Zephyr', classe: 'ILCA 6', numeroVoile: 'QC-9477', barreur: 'Olivier Pelletier' },
  { id: 14, nom: 'Brise Marine', classe: '470', numeroVoile: 'QC-9512', barreur: 'Alice Beaudoin' },
  { id: 15, nom: 'Neptune', classe: 'Finn', numeroVoile: 'QC-9638', barreur: 'Thomas Gauthier' },
  { id: 16, nom: 'Aigle des Mers', classe: 'J/24', numeroVoile: 'QC-9774', barreur: 'Juliette Martin' },
  { id: 17, nom: 'Skylark', classe: 'Optimist', numeroVoile: 'QC-9829', barreur: 'Jacob Caron' },
  { id: 18, nom: 'Azur', classe: '29er', numeroVoile: 'QC-9955', barreur: 'Clara Morin' },
  { id: 19, nom: 'Tempete Douce', classe: 'Catamaran', numeroVoile: 'QC-1008', barreur: 'Leo Girard' },
  { id: 20, nom: 'Solstice', classe: 'Laser', numeroVoile: 'QC-1126', barreur: 'Eva Plante' },
  { id: 21, nom: 'Beluga', classe: 'ILCA 7', numeroVoile: 'QC-1241', barreur: 'Alexis Cormier' },
  { id: 22, nom: 'Marlin', classe: 'J/22', numeroVoile: 'QC-1397', barreur: 'Florence Lavoie' },
  { id: 23, nom: 'Goeland', classe: '420', numeroVoile: 'QC-1450', barreur: 'Charles Proulx' },
  { id: 24, nom: 'Lueur', classe: 'Star', numeroVoile: 'QC-1583', barreur: 'Zoe Bernier' },
  { id: 25, nom: 'Galatee', classe: '470', numeroVoile: 'QC-1669', barreur: 'William Fortier' },
  { id: 26, nom: 'Maree Haute', classe: 'Finn', numeroVoile: 'QC-1714', barreur: 'Camille Blais' },
  { id: 27, nom: 'Polaire', classe: 'J/24', numeroVoile: 'QC-1842', barreur: 'Henri Simard' },
  { id: 28, nom: 'Rubis', classe: 'Optimist', numeroVoile: 'QC-1960', barreur: 'Maya Parent' },
]

export function findBoatById(id: number): BoatRow | undefined {
  return boats.find((boat) => boat.id === id)
}

