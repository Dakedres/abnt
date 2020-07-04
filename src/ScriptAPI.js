const PathUtil = require('./util/PathUtil')

class ScriptAPI {
  static from(index, path) {
    const bundle = window.le._bundles[index]

    return new this(bundle, path)
  }

  constructor(bundle, path = '/') {
    this._handler = bundle
    this.cwd = path
  }

  /**
   * Returns an instance of the API for a different working directory.
   * @param {String} path The new working directory
   */
  for(path) {
    return new this.constructor(this._handler, path)
  }

  get location() {
    return this._handler.path
  }

  /**
   * Resolves an absolute path in the bundle from the API's current working directory.
   * @param {String} path Relative path
   */
  resolveRelative(path) {
    return PathUtil.join(this.cwd, path)
  }

  /**
   * Loads a JavaScript file in the bundle with the $bundle api.
   * @param {String} path The path to the Javscript file you want to run.
   * @param {Window} [window] Window to load the script into, only supports child windows.
   * @returns {Promise} The <script> element that loaded the file
   */
  async load(path, window) {
    const resolvedPath = this.resolveRelative(path)

    return this._handler.loadScript(resolvedPath, window)
  }

  /**
   * Returns a file's content from the bundle.
   * @param {String} path The path to the file you want to open.
   * @param {String} format Class type you want the file data returned in, supports ObjectURL, Blob and anything that can be converted from it by $io.
   * @returns {Promise} The file in the object type specified.
   */
  open(path, format) {
    const resolvedPath = this.resolveRelative(path)

    return this._handler.open(resolvedPath, format)
  }
}

module.exports = ScriptAPI