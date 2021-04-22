// I hate using the vanilla console API.

const methods = [
  'log',
  'info',
  'warn',
  'error',
  'debug'
]

class ConsoleWrapper {
  group(name, callback, collapsed) {
    const start = collapsed ? console.groupCollapsed : console.group

    start(name)
    
    try {
      callback(this)
    } catch(e) {
      console.error(e)
    }

    console.groupEnd()
    return this
  }
}

for(const method of methods)
  ConsoleWrapper.prototype[method] = function(...args) {
    console[method](...args)
    return this
  }

module.exports = ConsoleWrapper