const { $exe, $fs, $io, le } = window,
      AsarHandler = require('./AsarHandler'),
      constants = require('../util/constants'),
      Loader = require('../util/Loader'),
      PathUtil = require('../util/PathUtil'),
      BundleConfig = require('./BundleConfig'),
      BundleAPI = require('./BundleAPI')

const { utils } = $fs,
      { configPath } = constants.bundle,
      { app, js } = constants

const toArrayBuffer = buffer => {
  const arraybuffer = new ArrayBuffer(buffer.length),
        view = new Uint8Array(arraybuffer)

  for(const i in buffer)
    view[i] = buffer[i]

  return arraybuffer
}

class Bundle extends AsarHandler {
  constructor(buffer, path, id) {
    super(buffer)

    const exists = super.exists(configPath)

    if(exists) {
      const configRaw = super.get(configPath).toString('utf-8')

      this.config = new BundleConfig(JSON.parse(configRaw))
    } else {
      throw app.errors.configError('No config file was found.')
    }

    this.path = path
    this.id = id
    this.cache = new Map()
  }

  _invalidFormat() {
    throw new Error(`Invalid format "${format}"`)
  }

  get(path) {
    let arraybuffer = this.cache.get(path)

    if(!arraybuffer) {
      const buffer = super.get(path)

      arraybuffer = toArrayBuffer(buffer)
      this.cache.set(path, arraybuffer)
    }

    return arraybuffer
  }

  async run() {
    const { entry } = this.config

    if(typeof entry !== 'string')
      throw app.errors.configError('Bundle entry invalid or not found.')

    const mimetype = le._get.ext.mime[utils.getExt(entry)],
          path = PathUtil.resolve(entry)

    if(mimetype != 'application/javascript')
      app.errors.configError(`Cannot handle entry files of type "${mimetype}".`)

    this.load(path)
  }

  // Returns a promise
  _createScript(path, scopeObject) {
    // Refactor this: use function constructor for `modified`, make apiLocation 
    // generated by it's own function with all of the external data needed as
    // arguments. These can be passed with an array and JSON.stringify used.
    //
    // Done?

    const code = super.get(path).toString('utf-8'),
          scope = scopeObject == window ? 'this' : 'this.parent',
          api = js.getAPI(scope, path, this.id)

    return js.payloadWrapper(code, this.config.topLevelAwait, api)
  }

  _createModule(...args) {
    const script = this._createScript(...args)
  }

  load(path, scope = window) {
    const script = this._createScript(path, scope),
          blob = new Blob([ script ], { type: js.mimetype }),
          url = URL.createObjectURL(blob)

    return new Loader(scope.document).script(url)
  }

  openScript(path) {
    return new BundleAPI(this, path)
  }
}

module.exports = Bundle