const { $file, $fs } = window,
      BundleHandler = require('./BundleHandler'),
      promisify = require('./util/promisify'),
      constants = require('./util/constants'),
      merge = require('./util/merge'),
      ScriptAPI = require('./ScriptAPI')

const openAsync = promisify($file.open),
      { app } = constants,
      { utils } = $fs

class App {
  constructor() {
    const self = this
    
    this.exec = function() {
      self.run(this.arg.arguments, this.cli)
    }
  }
  
  categories = app.categories
  name = app.id
  silent = true
  icon = constants.nt.defaultIcon
  accept = constants.asar.mimetype
  ScriptAPI = ScriptAPI

  run(args, cli) {
    try {
      const path = utils.resolvePath(args[0])
    
      this.openBundle(path)
    } catch (err) {
      cli.log.error(`Could not open bundle:\n${err}`)
    }
  }

  async openBundle(path) {
    const arraybuffer = await openAsync(path, 'ArrayBuffer'),
          buffer = Buffer.from(arraybuffer),
          bundle = new BundleHandler(buffer, path)

    if(this.debug.enabled) {
      this.debug.instances.push({
        path,
        bundle
      })
    }

    return await bundle.start()
  }

  debug = {
    enabled: true,
    instances: [],
  }

  init = {
    start() {
      this.patchSystem()
      this.iterateBoot()
    },

    patchSystem() {
      // Import it here to prevent possible race conditions
      const { _get } = window.le

      window.le._get = merge(_get, app.asarPatch)
      window.le._bundles = []
    },

    iterateBoot() {
      const { bootPath } = constants.nt

      const callback = object => {
        const files = Object.keys(object)
      
        for(const file of files) {
          if(utils.getExt(file) == 'abnt') {
            const path = bootPath + '/' + file
      
            app.openBundle(path)
          }
        }
      }

      $file.scan(bootPath, callback)
    }
  }
}

module.exports = App