export function getRedirect(
  url: string,
  initParams: RequestInit
): Promise<string> {
  const control = new AbortController()

  return new Promise((resolve, reject) => {
    fetch(url, { ...initParams, signal: control.signal })
      .then((res) => {
        resolve(res.url)
        control.abort()
      })
      .catch(reject)
  })
}
