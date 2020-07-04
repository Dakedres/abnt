const { utils } = window.$fs

class PathUtil {
  static resolve(path) {
    const scanPath = (array, dir, i) => {
      const isRoot = array.slice(-1)[0] == '/' || (array.length == 0 && i > 0)
      
      if(isRoot)
        return [ '/' ] 

      switch(dir) {
        case '.':
          return array

        case '..':
          return array.slice(0, -1)

        default:
          return array.concat(dir)
      }
    }
    
    return utils
      .resolvePath(path)
      .split('/')
      .reduce(scanPath, [])
      .join('/')
  }

  static join(left, right) {
    const out = right.startsWith('/') ? right : [ left, right ].join('/')

    return this.resolve(out)
  }
}

module.exports = PathUtil