// $loader alternative that can be bind to other scopes

class Loader {
  constructor(document = window.document) {
    this.document = document
  }

  createElement(tag, resource, rel) {
    const executor = (resolve, reject) => {
      const { document } = this,
            element = document.createElement(tag)
  
      element[tag === 'script' ? 'src' : 'href'] = resource
      element.rel = rel
      element.onload = () => resolve(element)
      document.head.appendChild(element)
    }
  
    return new Promise(executor)
  }

  script(src) {
    return this.createElement('script', src)
  }

  css(href) {
    return this.createElement('link', href, 'stylesheet')
  }
}

module.exports = Loader