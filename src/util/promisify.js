const promisify = original => {
  const async = (...args) => {
    const executor = (resolve, reject) => {
      try {
        original(...args, resolve)
      } catch(error) {
        reject(error)
      }
    }
  
    return new Promise(executor)
  }

  return async
}

module.exports = promisify