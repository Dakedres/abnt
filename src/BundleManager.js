const { $file } = window,
      promisify = require('./util/promisify'),
      ConsoleWrapper = require('./util/console'),
      Bundle = require('./Bundle'),
      AsarHandler = require('./Bundle/AsarHandler')    

const openAsync = promisify($file.open),
      console = new ConsoleWrapper

class BundleManager extends Array {
  constructor() {
    super()
    
    this._ids = {}
    const self = this

    const handler = {
      get(target, prop) {
        prop = self._ids[prop] || prop

        return target[prop]
      }
    }

    return new Proxy(this, handler)
  }

  create(...args) {
    const id = this.length,
          bundle = new Bundle(...args, id)

    this._ids[bundle.path] = id
    this.push(bundle)

    return bundle
  }

  async open(path) {
    const arraybuffer = await openAsync(path, 'ArrayBuffer'),
          buffer = Buffer.from(arraybuffer)

    let bundle

    try {
      bundle = this.create(buffer, path)
      bundle.run()
    } catch(err) {
      const dump = bundle || new AsarHandler(buffer)

      const group = () => {
        console.error(err)
        console.info('Dump: ', dump)
      }

      console.group(`Could not open bundle at '${path}'`, group)
    }

    return bundle
  }
}

module.exports = BundleManager