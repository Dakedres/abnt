const asar = {
  mimetype: 'application/asar',
  headerSizeIndex: 12,
  headerOffset: 16,
  uInt32Size: 4
}

const bundle = {
  configPath: '/bundle.config.json'
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
  }
}

const nt = {
  bootPath: '/a/boot',
  defaultIcon: 'apps/iframe.png'
}

module.exports = {
  asar,
  bundle,
  app,
  nt
}