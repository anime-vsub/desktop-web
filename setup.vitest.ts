window.Http = {
  version: "0.0.21",
  get(options) {
    return fetch(options.url)
      .then((res) => res.text())
      .then((text) => {
        return {
          data: text,
          status: 200,
        }
      })
  },
  post(options) {
    return fetch(options.url, {
      method: "POST",
      body: JSON.stringify(options.data),
    })
      .then((res) => res.text())
      .then((text) => {
        return {
          data: text,
          status: 200,
        }
      })
  },
}
