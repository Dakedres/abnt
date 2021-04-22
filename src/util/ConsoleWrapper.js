const commonMethods = [
  'log',
  'info',
  'error',
  'warn',
  'debug',
  'clear'
]

// Generic

class GenericWrapper {
  constructor(base) {
    this.base = base
  }
}

for(const methodName of commonMethods) {
  GenericWrapper.prototype[methodName] = function(...args) {
    this.base[methodName](...args)
  }
}

// $log

class CLIWrapper extends GenericWrapper {
  group(callback) {
    const group = new CLIGroup(this.base)

    callback(group)
    group._print()
  }
}

class CLIGroup extends CLIWrapper {
  constructor(base) {
    super(base)

    this.elements = []
  }

  _print() {
    const parent = this.base.code('')

    for(const elements of this.elements)
      parent.appendChild(element)
  }
}

for(const methodName of commonMethods) {
  CLIGroup.prototype[methodName] = function(...args) {
    const child = this.base[methodName](...args)

    this.elements.push(child)
  }
}

// Browser

class BrowserWrapper extends GenericWrapper {
  static matches

  group(callback) {
    this.base.group()
    callback(new this(this.base))
    this.base.groupEnd()
  }
}