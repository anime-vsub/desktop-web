export function getIdSeason(season: string): `${number}` | null {
  return /(\d+)$/.exec(season)?.[1] as `${number}` ?? null
}
