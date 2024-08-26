import { unAgo } from "./un-ago"

describe("unAgo", () => {
  vi.spyOn(Date, "now").mockImplementation(() => 1724556226095)

  const inputs = [
    ["1 giây", new Date(Date.now() - 1000)],
    ["2 phút", new Date(Date.now() - 120000)],
    ["3 giờ", new Date(Date.now() - 10800000)],
    ["4 ngày", new Date(Date.now() - 345600000)],
    ["5 tuần", new Date(Date.now() - 3024000000)],
    ["6 tháng", new Date(Date.now() - 60_000 * 60 * 24 * 30 * 6)],
    ["7 năm", new Date(Date.now() - 60_000 * 60 * 24 * 365 * 7)]
  ] as const

  test.each(inputs)("parses '%s' correctly", (input, expected) => {
    expect(unAgo(input)).toEqual(expected)
  })
  test("throws an error for unknown units", () => {
    const input = "1 foo"
    expect(() => unAgo(input)).toThrowError(`Can't parse "${input}"`)
  })

  test("throws an error for non-numeric values", () => {
    const input = "abc giây"
    expect(() => unAgo(input)).toThrowError(`Can't parse "${input}"`)
  })

  test("handles edge cases", () => {
    const inputs = [
      ["0 giây", new Date(Date.now())],
      ["-1 giây", new Date(Date.now() + 1000)]
    ] as const

    inputs.forEach(([input, expected]) => {
      expect(unAgo(input)).toEqual(expected)
    })
  })
})
