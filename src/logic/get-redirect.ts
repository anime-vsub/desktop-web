export function getRedirect(req: Request): Promise<string> {
  const control = new AbortController()

  return new Promise((resolve, reject) => {
    fetch(req.url, { ...req, signal: control.signal })
      .then((res) => {
        // eslint-disable-next-line promise/always-return
        resolve(res.url)
        control.abort()
      })
      .catch(reject)
  })
}
