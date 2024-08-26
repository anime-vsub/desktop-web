export function unAgo(text: string) {
  const [int$, unit] = text
    .split(" ", 2)
    .map((item) => item.trim().toLowerCase())
  const int = parseFloat(int$)

  if (!Number.isNaN(int))
    switch (unit) {
      case "giây":
        return new Date(Date.now() - int * 1000)
      case "phút":
        return new Date(Date.now() - int * 60 * 1000)
      case "giờ":
        return new Date(Date.now() - int * 60 * 60 * 1000)
      case "ngày":
        return new Date(Date.now() - int * 24 * 60 * 60 * 1000)
      case "tuần":
        return new Date(Date.now() - int * 7 * 24 * 60 * 60 * 1000)
      case "tháng":
        return new Date(Date.now() - int * 30 * 24 * 60 * 60 * 1000)
      case "năm":
        return new Date(Date.now() - int * 365 * 24 * 60 * 60 * 1000)
    }
  throw new Error(`Can't parse "${text}"`)
}
