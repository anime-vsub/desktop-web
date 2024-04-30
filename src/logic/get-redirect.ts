export function getRedirect(req: Request): Promise<string> {
  const control = new AbortController()

  return new Promise((resolve, reject) => {
    fetch(req.url, { ...req, signal: control.signal })
      .then((res) => {
         
        resolve(res.url)
        control.abort()
      })
      .catch(reject)
  })
}
