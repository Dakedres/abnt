const asar = {
  mimetype: 'application/asar',
  headerSizeIndex: 12,
  headerOffset: 16,
  uInt32Size: 4
}

const defaultConfig = {
  entry: undefined,
  topLevelAwait: true
}

const bundle = {
  configPath: '/bundle.config.json',
  defaultConfig,
  apiGlobal: '$bundle',
  errors: {
    invalidFormat: format => {
      throw new Error(`${format} is not a valid format.`)
    }
  }
}

const app = {
  id: 'abnt',
  categories: 'Viewer',
  asarPatch: {
    ext: {
      mime: {
        application: {
          asar: [
            "asar,abnt"
          ]
        }
      }
    },
    mime: {
      ext: {
        abnt: asar.mimetype,
        asar: asar.mimetype
      }
    }
  },
  errors: {
    pathError(path, reason) {
      class PathError extends Error {}
      const message = [ `Invalid path "${path}"`, reason ].join(': ')

      return new PathError(message)
    },

    configError(reason) {
      class ConfigError extends Error {}

      return new ConfigError(reason)
    },

    prematureInjection(path) {
      throw new Error(`Resource "${path}" was injected into a window before it had finished loading.`)
    }
  }
}

const js = {
  // Make async required and then use .
  payloadWrapper: (code, async, api) =>
`(${async ? 'async ' : ''}${bundle.apiGlobal} => {
  ${code}
})(${api})`,

  getAPI: (scope, path, index) =>
`${scope}.le._bundles[${index}].openScript(${JSON.stringify(path)})`,

  mimetype: 'text/javascript'
}

const nt = {
  bootPath: '/a/boot',
  defaultIcon: 'apps/iframe.png'
}

module.exports = {
  asar,
  bundle,
  app,
  js,
  nt
}