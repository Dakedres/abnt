const PathUtil = require('../util/PathUtil'),
      { utils } = window.$fs,
      constants = require('../util/constants')

const { errors } = constants.bundle

/**
 * @namespace $bundle
 * @typedef {BundleAPI}
 */

/**
 * Class for interacting with the data in the bundle
 */
class BundleAPI {
  constructor(bundle, path = '/') {
    this._bundle = bundle

    /**
     * The current working directory in the bundle, equivalent to __dirname in node, for instance.
     * @typedef {String}
     */
    this.cwd = utils.getFolderPath(path)
  }

  /**
   * Path in Windows93's filesystem for the bundle
   * @typedef {String}
   */
  get location() {
    return this._bundle.path
  }

  /**
   * Returns an instance of the API for a different working directory.
   * @param {String} path The new working directory
   * @returns {BundleAPI} The new API instance
   */
  for(path) {
    return new this.constructor(this._bundle, path)
  }


  /**
   * Resolves an absolute path in the bundle from the API's current working directory.
   * @param {String} path Relative path
   * @returns {String} Absolute path
   */
  resolveRelative(path) {
    return PathUtil.join(this.cwd, path)
  }

  /**
   * 
   * @param {String} path The path to the directory to list the contents of
   * @param {Boolean} asEntries Whether or not to return the entries as {@link Dirent} objects
   * @returns {Array<String>|Array<Dirent>}
   */
  readDir(path = '.', asEntries = false) {
    const resolvedPath = this.resolveRelative(path),
          { files } = this._bundle.find(resolvedPath)

    const toEntry = ([ name, value ]) =>
      new Dirent(name, !(value.executable === true))

    return asEntries ? Object.entries(files).map(toEntry) : Object.keys(files)
  }

  /**
   * Loads a JavaScript file with the $bundle api.
   * @param {String} path The path to the Javscript file you want to run.
   * @param {Window} [window] Window to load the script into, only supports child windows.
   * @returns {HTMLScriptElement} The script element that loaded the file
   */
  load(path, window) {
    const resolvedPath = this.resolveRelative(path)

    if(window.document.readyState != 'complete')
      errors.prematureInjection(path)

    return this._bundle.load(resolvedPath, window)
  }

  _open(path, format, formatCallback) {
    const arraybuffer = this._bundle.get(path),
          ext = utils.getExt(path),
          blob = new Blob([ arraybuffer ], { type: le._get.ext.mime[ext] })

    switch(format) {
      case 'ArrayBuffer':
        return arraybuffer

      case 'Blob':
        return blob

      case 'URL':
        return URL.createObjectURL(blob)

      case 'String':
        const buf = Buffer.from(arraybuffer)

        return buf.toString('utf-8')

      default:
        if(formatCallback)
          return formatCallback(format, { path, blob })
        else
          errors.invalidFormat(format)
    }
  }

  _formatAsync(format, { path, blob }) {
    const toFormat = $io.Blob[format],
          mimetype = utils.getMime(path)
  
    if(!toFormat)
      errors.invalidFormat(format)
  
    const executor = (resolve, reject) => {
      const callback = (...args) =>
        resolve(...args)
  
      try {
        toFormat(blob, callback, mimetype)
      } catch(err) {
        reject(err)
      }
    }
  
    return new Promise(executor)
  }

  /**
   * Returns a file's content from the bundle.
   * @param {String} path The path to the file you want to open.
   * @param {String} format Class type you want the file data returned in, supports URL, Blob and anything that can be converted from it by $io.
   * @returns {Promise} The file contents.
   */
  async open(path, format) {
    const resolvedPath = this.resolveRelative(path)

    // Instead of toFormat I could just replace this with that one util
    // I wrote for newfs, but I'll wait until I've got an actual util
    // lib for that.
    return await this._open(resolvedPath, format, this._formatAsync)
  }

  /**
   * Like {@link BundleAPI.open | open()} but sync, and with a smaller range of format support
   * @param {String} path The path to the file you want to open.
   * @param {String} format Class type you want the file data returned in, this can be URL, Blob, ArrayBuffer, or String
   * @returns {URL|Blob|ArrayBuffer|String} The file contents.
   */
  openSync(path, format) {
    const resolvedPath = this.resolveRelative(path)

    return this._open(resolvedPath, format)
  }
}

/**
 * Represents an entry in a directory
 */
class Dirent {
  constructor(name, isDir) {
    /**
     * Name of the entry
     * @typedef {String}
     */
    this.name = name

    /**
     * Whether or not the entry is a directory
     * @typedef {Boolean}
     */
    this.isDirectory = isDir
  }

  /**
   * Relative path to the directory
   * @typedef {String}
   */
  get relativePath() {
    return this.isDirectory ? this.name + '/' : this.name
  }
}

module.exports = BundleAPI