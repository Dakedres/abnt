const constants = require('../util/constants'),
      PathUtil = require('../util/PathUtil')

const copyDefined = (left, right) => {
  const keys = Object.keys(left),
        out = { ...left }

  for(const key of keys)
    out[key] = right[key]

  return out
}

class BundleConfig {
  constructor(config) {
    const object = copyDefined(constants.bundle.defaultConfig, config)

    Object.assign(this, object)

    if(this.entry)
      this.entry = PathUtil.resolve(this.entry)
    else
      throw new Error('Bundle entry not defined')
  }
}

module.exports = BundleConfig