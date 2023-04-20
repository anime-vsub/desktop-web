export function encodeString(source: string, index: number): string {
  // eslint-disable-next-line functional/no-let
  let a = ""
  source.toString()
  // eslint-disable-next-line functional/no-loop-statements
  for (let i = 0; i < source.length; i++) {
    const r = source.charCodeAt(i) ^ index
    a += String.fromCharCode(r)
  }

  return a
}

export function decodeVuigheM3U8(
  sources: Record<number, string>,
  epId: number
): {
  url: string
  play: boolean
  server: number
}[] {
  const t = []

  const i = Object.keys(sources) as unknown as number[]
  // eslint-disable-next-line functional/no-loop-statements
  for (let a = 0; a < i.length; a++)
    t.push({
      url: encodeString(sources[i[a]], epId % 100),
      play: !1,
      server: i[a],
    })
  return t
}
