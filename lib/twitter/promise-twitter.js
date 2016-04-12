export default (method, url, params = {}) => {
  return new Promise((resolve, reject) => {
    client[method](url, params, (error, data) => {
      if (error) return reject(error)
      return resolve(data)
    })
  })
}


