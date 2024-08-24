export function getRedirect(req: Request): Promise<string> {
  return fetch(req, {
    ...req,
    method: "head"
  }).then((res) => res.url)
}
