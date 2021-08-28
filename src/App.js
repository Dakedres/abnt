const { $file, $fs } = window,
      BundleManager = require('./BundleManager'),
      AsarHandler = require('./Bundle/AsarHandler')
      constants = require('./util/constants'),
      merge = require('./util/merge')

const { app } = constants,
      { utils } = $fs

let bundleManager = new BundleManager()

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
  bundleManager = bundleManager

  // I should probably make AsarHandler it's own seperate
  //   project sometime, but for now I'm just gonna expose
  //   the library like this.
  AsarHandler = AsarHandler

  run(args, cli) {
    try {
      const path = utils.resolvePath(args[0])
    
      this.open(path)
    } catch (err) {
      cli.log.error(`Could not open bundle:\n${err}`)
    }
  }

  open(...args) {
    this.bundleManager.open(...args)
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
      window.le._bundles = bundleManager
    },

    iterateBoot() {
      const { bootPath } = constants.nt

      const callback = object => {
        const files = Object.keys(object)
      
        for(const file of files) {
          if(utils.getExt(file) == 'abnt') {
            const path = bootPath + '/' + file
      
            app.open(path)
          }
        }
      }

      $file.scan(bootPath, callback)
    }
  }
}

module.exports = App