const makeBuffer = extendsClass => {

  class FakeBuffer extends Uint8Array {
    constructor() {
      super()

      const handler = {
        get(target, prop) {
          let value = target[prop]

          if(!value) {
            value = this._handlers.to
          }
        }
      }

      this.proxy = new Proxy(handler)
    }

    _handlers = [
      {
        
      }
    ]

    _swap(size, signed = false) {
      const extendsClass = self[`${signed ? '' : 'U'}Int${size}Array`]

      makeBuffer(extendsClass)
    }
  }

  return FakeBuffer

}