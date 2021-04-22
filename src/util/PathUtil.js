class PathUtil {
  static normalize(path, ...otherFuncs) {
    let split = path
      .split('/')
      .filter(dir => dir)

    for(const func of otherFuncs)
      split = func(split)
    
    return split.join('/')
  }

  static resolve(path) {
    const scanPath = (array, dir, i) => {
      switch(dir) {
        case '.':
          return array

        case '..':
          // Let's not get below root
          return array.length > 1 ? array.slice(0, -1) : array

        default:
          return array.concat(dir)
      }
    }
    
    const scan = splitPath =>
      splitPath.reduce(scanPath, [ '/' ])

    return this.normalize(path, scan)
  }

  static join(left, right) {
    const out = right.startsWith('/') ? right : [ left, right ].join('/')

    return this.resolve(out)
  }
}

module.exports = PathUtil