class PayloadWrapper {
  wrap(code, async) {
    return `(${async ? 'async ' : ''}$bundle => {{code}})()`
  }
}