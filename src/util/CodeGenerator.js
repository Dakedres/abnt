const serialize = data => {
  const isLiteral = data instanceof GeneratorLiteral

  if(isLiteral)
    return data
  else
    return JSON.stringify(data)
}

const AsyncFunction 

class GeneratorLiteral extends String {}

class GeneratorFunction extends GeneratorLiteral {
  static from(async, body, ...args) {
    const funcType = async ? Function : AsyncFunction,
          func = new funcType(...args, body)

    return new this(func)
  }

  constructor(func) {
    super(func)
  }

  call(scope, ...args) {
    const argString = args
      .map(serialize)
      .join()

    let method

    if(scope)
      method = `.call(${serialize(scope)}, ${argString})`
    else
      method = `(${argString})`

    return new GeneratorLiteral(`(${this})${method}`)
  }
}

class CodeGenerator {
  literal(...args) {
    return new GeneratorLiteral(...args)
  }

  function(...args) {
    return GeneratorFunction.from(...args)
  }

  from(data) {
    switch(typeof data) {
      case 'function':
        return new GeneratorFunction(data)

      default:
        const json = JSON.stringify(data)
        
        return this.literal(json)
    }
  }
}

module.exports = CodeGenerator