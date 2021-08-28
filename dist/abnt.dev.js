/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/***/ (function(module) {

eval("function _defineProperty(obj, key, value) {\n  if (key in obj) {\n    Object.defineProperty(obj, key, {\n      value: value,\n      enumerable: true,\n      configurable: true,\n      writable: true\n    });\n  } else {\n    obj[key] = value;\n  }\n\n  return obj;\n}\n\nmodule.exports = _defineProperty;\n\n//# sourceURL=webpack://abnt/./node_modules/@babel/runtime/helpers/defineProperty.js?");

/***/ }),

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("var _defineProperty = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\");\n\nconst {\n  $file,\n  $fs\n} = window,\n      BundleManager = __webpack_require__(/*! ./BundleManager */ \"./src/BundleManager.js\"),\n      AsarHandler = __webpack_require__(/*! ./Bundle/AsarHandler */ \"./src/Bundle/AsarHandler.js\");\n\nconstants = __webpack_require__(/*! ./util/constants */ \"./src/util/constants.js\"), merge = __webpack_require__(/*! ./util/merge */ \"./src/util/merge.js\");\nconst {\n  app\n} = constants,\n      {\n  utils\n} = $fs;\nlet bundleManager = new BundleManager();\n\nclass App {\n  constructor() {\n    _defineProperty(this, \"categories\", app.categories);\n\n    _defineProperty(this, \"name\", app.id);\n\n    _defineProperty(this, \"silent\", true);\n\n    _defineProperty(this, \"icon\", constants.nt.defaultIcon);\n\n    _defineProperty(this, \"accept\", constants.asar.mimetype);\n\n    _defineProperty(this, \"bundleManager\", bundleManager);\n\n    _defineProperty(this, \"AsarHandler\", AsarHandler);\n\n    _defineProperty(this, \"init\", {\n      start() {\n        this.patchSystem();\n        this.iterateBoot();\n      },\n\n      patchSystem() {\n        // Import it here to prevent possible race conditions\n        const {\n          _get\n        } = window.le;\n        window.le._get = merge(_get, app.asarPatch);\n        window.le._bundles = bundleManager;\n      },\n\n      iterateBoot() {\n        const {\n          bootPath\n        } = constants.nt;\n\n        const callback = object => {\n          const files = Object.keys(object);\n\n          for (const file of files) {\n            if (utils.getExt(file) == 'abnt') {\n              const path = bootPath + '/' + file;\n              app.open(path);\n            }\n          }\n        };\n\n        $file.scan(bootPath, callback);\n      }\n\n    });\n\n    const self = this;\n\n    this.exec = function () {\n      self.run(this.arg.arguments, this.cli);\n    };\n  }\n\n  run(args, cli) {\n    try {\n      const path = utils.resolvePath(args[0]);\n      this.open(path);\n    } catch (err) {\n      cli.log.error(`Could not open bundle:\\n${err}`);\n    }\n  }\n\n  open(...args) {\n    this.bundleManager.open(...args);\n  }\n\n}\n\nmodule.exports = App;\n\n//# sourceURL=webpack://abnt/./src/App.js?");

/***/ }),

/***/ "./src/Bundle/AsarHandler.js":
/*!***********************************!*\
  !*** ./src/Bundle/AsarHandler.js ***!
  \***********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("const constants = __webpack_require__(/*! ../util/constants */ \"./src/util/constants.js\"),\n      PathUtil = __webpack_require__(/*! ../util/PathUtil */ \"./src/util/PathUtil.js\");\n\nconst {\n  headerOffset,\n  headerSizeIndex,\n  uInt32Size\n} = constants.asar,\n      {\n  errors\n} = constants.app; // Essentially just ripped from the chromium-pickle-js source, thanks for\n// doing my math homework.\n\nconst alignInt = (i, alignment) => i + (alignment - i % alignment) % alignment;\n\nconst textDecoder = new TextDecoder('utf-8');\n\nconst crawlHeader = function self(files, dirname) {\n  const prefix = itemName => (dirname ? dirname + '/' : '') + itemName;\n\n  let children = [];\n\n  for (const filename in files) {\n    const extraFiles = files[filename].files;\n\n    if (extraFiles) {\n      const extra = self(extraFiles, filename);\n      children = children.concat(extra);\n    }\n\n    children.push(filename);\n  }\n\n  return children.map(prefix);\n};\n\nclass AsarHandler {\n  constructor(buffer) {\n    if (buffer.length > Number.MAX_SAFE_INTEGER) throw new Error('This file is too large for AsarHandler to safely work with, sorry for the inconvenience.');\n    const data = new DataView(buffer),\n          headerSize = data.getUint32(headerSizeIndex, true),\n          // Pickle wants to align the headers so that the payload length is\n    // always a multiple of 4. This means you'll get \"padding\" bytes\n    // after the header if you don't round up the stored value.\n    //\n    // IMO why not just store the aligned int and have us trim the json,\n    // but it's whatever.\n    headerEnd = headerOffset + headerSize,\n          filesOffset = alignInt(headerEnd, uInt32Size),\n          rawHeader = buffer.slice(headerOffset, headerEnd),\n          files = buffer.slice(filesOffset);\n    this.header = JSON.parse(this._decodeString(rawHeader));\n    this.files = files;\n    this.contents = crawlHeader(this.header.files);\n  }\n\n  _decodeString(buffer) {\n    return textDecoder.decode(buffer);\n  } // Only takes posix-like paths\n\n\n  find(path) {\n    const navigate = (currentItem, navigateTo) => {\n      if (currentItem.files) {\n        const nextItem = currentItem.files[navigateTo];\n\n        if (!nextItem) {\n          if (path == '/') // This breaks it lol\n            return this.header;\n          throw errors.pathError(path, `${navigateTo} could not be found.`);\n        }\n\n        return nextItem;\n      } else {\n        throw errors.pathError(path, `${navigateTo} is not a directory.`);\n      }\n    };\n\n    return PathUtil.normalize(path).split('/').reduce(navigate, this.header);\n  }\n\n  get(path) {\n    const {\n      offset,\n      size\n    } = this.find(path),\n          offsetInt = parseInt(offset);\n    return this.files.slice(offsetInt, offsetInt + size);\n  }\n\n  exists(path) {\n    const normalizedPath = PathUtil.normalize(path);\n    return this.contents.includes(normalizedPath);\n  }\n\n}\n\nmodule.exports = AsarHandler;\n\n//# sourceURL=webpack://abnt/./src/Bundle/AsarHandler.js?");

/***/ }),

/***/ "./src/Bundle/BundleAPI.js":
/*!*********************************!*\
  !*** ./src/Bundle/BundleAPI.js ***!
  \*********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("const PathUtil = __webpack_require__(/*! ../util/PathUtil */ \"./src/util/PathUtil.js\"),\n      {\n  utils\n} = window.$fs,\n      constants = __webpack_require__(/*! ../util/constants */ \"./src/util/constants.js\");\n\nconst {\n  errors\n} = constants.bundle;\n/**\n * @namespace $bundle\n * @typedef {BundleAPI}\n */\n\n/**\n * Class for interacting with the data in the bundle\n */\n\nclass BundleAPI {\n  constructor(bundle, path = '/') {\n    this._bundle = bundle;\n    /**\n     * The current working directory in the bundle, equivalent to __dirname in node, for instance.\n     * @typedef {String}\n     */\n\n    this.cwd = utils.getFolderPath(path);\n  }\n  /**\n   * Path in Windows93's filesystem for the bundle\n   * @typedef {String}\n   */\n\n\n  get location() {\n    return this._bundle.path;\n  }\n  /**\n   * Returns an instance of the API for a different working directory.\n   * @param {String} path The new working directory\n   * @returns {BundleAPI} The new API instance\n   */\n\n\n  for(path) {\n    return new this.constructor(this._bundle, path);\n  }\n  /**\n   * Resolves an absolute path in the bundle from the API's current working directory.\n   * @param {String} path Relative path\n   * @returns {String} Absolute path\n   */\n\n\n  resolveRelative(path) {\n    return PathUtil.join(this.cwd, path);\n  }\n  /**\n   * Lists the contents of a directory\n   * @param {String} path The path to the directory to list the contents of\n   * @param {Boolean} asEntries Whether or not to return the entries as {@link Dirent} objects\n   * @returns {Array<String>|Array<Dirent>}\n   */\n\n\n  readDir(path = '.', asEntries = false) {\n    const resolvedPath = this.resolveRelative(path),\n          {\n      files\n    } = this._bundle.find(resolvedPath);\n\n    const toEntry = ([name, value]) => new Dirent(name, !(value.executable === true));\n\n    return asEntries ? Object.entries(files).map(toEntry) : Object.keys(files);\n  }\n  /**\n   * Checks if an entry exists\n   * @param {String} path The path to the directory or file to check\n   * @returns { Boolean } Whether or not the entry exists\n   */\n\n\n  access(path) {\n    const resolvedPath = this.resolveRelative(path);\n\n    try {\n      this._bundle.find(resolvedPath);\n\n      return true;\n    } catch (e) {\n      return false;\n    }\n  }\n  /**\n   * Loads a JavaScript file with the $bundle api.\n   * @param {String} path The path to the Javscript file you want to run.\n   * @param {Window} [window] Window to load the script into, only supports child windows.\n   * @returns {HTMLScriptElement} The script element that loaded the file\n   */\n\n\n  load(path, window) {\n    const resolvedPath = this.resolveRelative(path);\n    if (window.document.readyState != 'complete') errors.prematureInjection(path);\n    return this._bundle.load(resolvedPath, window);\n  }\n\n  _open(path, format, formatCallback) {\n    const buffer = this._bundle.get(path),\n          ext = utils.getExt(path),\n          blob = new Blob([buffer], {\n      type: le._get.ext.mime[ext]\n    });\n\n    switch (format) {\n      case 'ArrayBuffer':\n        return buffer;\n\n      case 'Blob':\n        return blob;\n\n      case 'URL':\n        return URL.createObjectURL(blob);\n\n      case 'String':\n        return this._bundle._decodeString(buffer);\n\n      default:\n        if (formatCallback) return formatCallback(format, {\n          path,\n          blob\n        });else errors.invalidFormat(format);\n    }\n  }\n\n  _formatAsync(format, {\n    path,\n    blob\n  }) {\n    const toFormat = $io.Blob[format],\n          mimetype = utils.getMime(path);\n    if (!toFormat) errors.invalidFormat(format);\n\n    const executor = (resolve, reject) => {\n      const callback = (...args) => resolve(...args);\n\n      try {\n        toFormat(blob, callback, mimetype);\n      } catch (err) {\n        reject(err);\n      }\n    };\n\n    return new Promise(executor);\n  }\n  /**\n   * Returns a file's content from the bundle.\n   * @param {String} path The path to the file you want to open.\n   * @param {String} format Class type you want the file data returned in, supports URL, Blob and anything that can be converted from it by $io.\n   * @returns {Promise} The file contents.\n   */\n\n\n  async open(path, format) {\n    const resolvedPath = this.resolveRelative(path); // Instead of toFormat I could just replace this with that one util\n    // I wrote for newfs, but I'll wait until I've got an actual util\n    // lib for that.\n\n    return await this._open(resolvedPath, format, this._formatAsync);\n  }\n  /**\n   * Like {@link BundleAPI.open | open()} but sync, and with a smaller range of format support\n   * @param {String} path The path to the file you want to open.\n   * @param {String} format Class type you want the file data returned in, this can be URL, Blob, ArrayBuffer, or String\n   * @returns {URL|Blob|ArrayBuffer|String} The file contents.\n   */\n\n\n  openSync(path, format) {\n    const resolvedPath = this.resolveRelative(path);\n    return this._open(resolvedPath, format);\n  }\n\n}\n/**\n * Represents an entry in a directory\n */\n\n\nclass Dirent {\n  constructor(name, isDir) {\n    /**\n     * Name of the entry\n     * @typedef {String}\n     */\n    this.name = name;\n    /**\n     * Whether or not the entry is a directory\n     * @typedef {Boolean}\n     */\n\n    this.isDirectory = isDir;\n  }\n  /**\n   * Relative path to the directory\n   * @typedef {String}\n   */\n\n\n  get relativePath() {\n    return this.isDirectory ? this.name + '/' : this.name;\n  }\n\n}\n\nmodule.exports = BundleAPI;\n\n//# sourceURL=webpack://abnt/./src/Bundle/BundleAPI.js?");

/***/ }),

/***/ "./src/Bundle/BundleConfig.js":
/*!************************************!*\
  !*** ./src/Bundle/BundleConfig.js ***!
  \************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("const constants = __webpack_require__(/*! ../util/constants */ \"./src/util/constants.js\"),\n      PathUtil = __webpack_require__(/*! ../util/PathUtil */ \"./src/util/PathUtil.js\");\n\nconst copyDefined = (left, right) => {\n  const keys = Object.keys(left),\n        out = { ...left\n  };\n\n  for (const key of keys) out[key] = right[key];\n\n  return out;\n};\n\nclass BundleConfig {\n  constructor(config) {\n    const object = copyDefined(constants.bundle.defaultConfig, config);\n    Object.assign(this, object);\n    if (this.entry) this.entry = PathUtil.resolve(this.entry);else throw new Error('Bundle entry not defined');\n  }\n\n}\n\nmodule.exports = BundleConfig;\n\n//# sourceURL=webpack://abnt/./src/Bundle/BundleConfig.js?");

/***/ }),

/***/ "./src/Bundle/index.js":
/*!*****************************!*\
  !*** ./src/Bundle/index.js ***!
  \*****************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("const {\n  $exe,\n  $fs,\n  $io,\n  le\n} = window,\n      AsarHandler = __webpack_require__(/*! ./AsarHandler */ \"./src/Bundle/AsarHandler.js\"),\n      constants = __webpack_require__(/*! ../util/constants */ \"./src/util/constants.js\"),\n      Loader = __webpack_require__(/*! ../util/Loader */ \"./src/util/Loader.js\"),\n      PathUtil = __webpack_require__(/*! ../util/PathUtil */ \"./src/util/PathUtil.js\"),\n      BundleConfig = __webpack_require__(/*! ./BundleConfig */ \"./src/Bundle/BundleConfig.js\"),\n      BundleAPI = __webpack_require__(/*! ./BundleAPI */ \"./src/Bundle/BundleAPI.js\");\n\nconst {\n  utils\n} = $fs,\n      {\n  configPath\n} = constants.bundle,\n      {\n  app,\n  js\n} = constants;\n\nclass Bundle extends AsarHandler {\n  constructor(buffer, path, id) {\n    super(buffer);\n    const exists = super.exists(configPath);\n\n    if (exists) {\n      const configRaw = this._decodeString(super.get(configPath));\n\n      this.config = new BundleConfig(JSON.parse(configRaw));\n    } else {\n      throw app.errors.configError('No config file was found.');\n    }\n\n    this.path = path;\n    this.id = id;\n    this.cache = new Map();\n  }\n\n  _invalidFormat() {\n    throw new Error(`Invalid format \"${format}\"`);\n  }\n\n  get(path) {\n    let buffer = this.cache.get(path);\n    if (!buffer) this.cache.set(path, buffer = super.get(path));\n    return buffer;\n  }\n\n  async run() {\n    const {\n      entry\n    } = this.config;\n    if (typeof entry !== 'string') throw app.errors.configError('Bundle entry invalid or not found.');\n\n    const mimetype = le._get.ext.mime[utils.getExt(entry)],\n          path = PathUtil.resolve(entry);\n\n    if (mimetype != 'application/javascript') app.errors.configError(`Cannot handle entry files of type \"${mimetype}\".`);\n    this.load(path);\n  } // Returns a promise\n\n\n  _createScript(path, scopeObject) {\n    // Refactor this: use function constructor for `modified`, make apiLocation \n    // generated by it's own function with all of the external data needed as\n    // arguments. These can be passed with an array and JSON.stringify used.\n    //\n    // Done?\n    const code = this._decodeString(super.get(path)),\n          scope = scopeObject == window ? 'this' : 'this.parent',\n          api = js.getAPI(scope, path, this.id);\n\n    return js.payloadWrapper(code, this.config.topLevelAwait, api);\n  }\n\n  _createModule(...args) {\n    const script = this._createScript(...args);\n  }\n\n  load(path, scope = window) {\n    const script = this._createScript(path, scope),\n          blob = new Blob([script], {\n      type: js.mimetype\n    }),\n          url = URL.createObjectURL(blob);\n\n    return new Loader(scope.document).script(url);\n  }\n\n  openScript(path) {\n    return new BundleAPI(this, path);\n  }\n\n}\n\nmodule.exports = Bundle;\n\n//# sourceURL=webpack://abnt/./src/Bundle/index.js?");

/***/ }),

/***/ "./src/BundleManager.js":
/*!******************************!*\
  !*** ./src/BundleManager.js ***!
  \******************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("const {\n  $file\n} = window,\n      promisify = __webpack_require__(/*! ./util/promisify */ \"./src/util/promisify.js\"),\n      ConsoleWrapper = __webpack_require__(/*! ./util/console */ \"./src/util/console.js\"),\n      Bundle = __webpack_require__(/*! ./Bundle */ \"./src/Bundle/index.js\"),\n      AsarHandler = __webpack_require__(/*! ./Bundle/AsarHandler */ \"./src/Bundle/AsarHandler.js\");\n\nconst openAsync = promisify($file.open),\n      console = new ConsoleWrapper();\n\nclass BundleManager extends Array {\n  constructor() {\n    super();\n    this._ids = {};\n    const self = this;\n    const handler = {\n      get(target, prop) {\n        prop = self._ids[prop] || prop;\n        return target[prop];\n      }\n\n    };\n    return new Proxy(this, handler);\n  }\n\n  create(...args) {\n    const id = this.length,\n          bundle = new Bundle(...args, id);\n    this._ids[bundle.path] = id;\n    this.push(bundle);\n    return bundle;\n  }\n\n  async open(path) {\n    const buffer = await openAsync(path, 'ArrayBuffer');\n    let bundle;\n\n    try {\n      bundle = this.create(buffer, path);\n      bundle.run();\n    } catch (err) {\n      const dump = bundle || new AsarHandler(buffer);\n\n      const group = () => {\n        console.error(err);\n        console.info('Dump: ', dump);\n      };\n\n      console.group(`Could not open bundle at '${path}'`, group);\n    }\n\n    return bundle;\n  }\n\n}\n\nmodule.exports = BundleManager;\n\n//# sourceURL=webpack://abnt/./src/BundleManager.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("const App = __webpack_require__(/*! ./App */ \"./src/App.js\"),\n      constants = __webpack_require__(/*! ./util/constants */ \"./src/util/constants.js\");\n\nconst app = new App();\napp.init.start();\nwindow.le._apps[constants.app.id] = app;\nsystem42.trigger('abnt:ready');\n\n//# sourceURL=webpack://abnt/./src/index.js?");

/***/ }),

/***/ "./src/util/Loader.js":
/*!****************************!*\
  !*** ./src/util/Loader.js ***!
  \****************************/
/***/ (function(module) {

eval("// $loader alternative that can be bind to other scopes\nclass Loader {\n  constructor(document = window.document) {\n    this.document = document;\n  }\n\n  createElement(tag, resource, rel) {\n    const executor = (resolve, reject) => {\n      const {\n        document\n      } = this,\n            element = document.createElement(tag);\n      element[tag === 'script' ? 'src' : 'href'] = resource;\n      element.rel = rel;\n\n      element.onload = () => resolve(element);\n\n      document.head.appendChild(element);\n    };\n\n    return new Promise(executor);\n  }\n\n  script(src) {\n    return this.createElement('script', src);\n  }\n\n  css(href) {\n    return this.createElement('link', href, 'stylesheet');\n  }\n\n}\n\nmodule.exports = Loader;\n\n//# sourceURL=webpack://abnt/./src/util/Loader.js?");

/***/ }),

/***/ "./src/util/PathUtil.js":
/*!******************************!*\
  !*** ./src/util/PathUtil.js ***!
  \******************************/
/***/ (function(module) {

eval("class PathUtil {\n  static normalize(path, ...otherFuncs) {\n    let split = path.split('/').filter(dir => dir);\n\n    for (const func of otherFuncs) split = func(split);\n\n    return split.join('/');\n  }\n\n  static resolve(path) {\n    const scanPath = (array, dir, i) => {\n      switch (dir) {\n        case '.':\n          return array;\n\n        case '..':\n          // Let's not get below root\n          return array.length > 1 ? array.slice(0, -1) : array;\n\n        default:\n          return array.concat(dir);\n      }\n    };\n\n    const scan = splitPath => splitPath.reduce(scanPath, ['/']);\n\n    return this.normalize(path, scan);\n  }\n\n  static join(left, right) {\n    const out = right.startsWith('/') ? right : [left, right].join('/');\n    return this.resolve(out);\n  }\n\n}\n\nmodule.exports = PathUtil;\n\n//# sourceURL=webpack://abnt/./src/util/PathUtil.js?");

/***/ }),

/***/ "./src/util/console.js":
/*!*****************************!*\
  !*** ./src/util/console.js ***!
  \*****************************/
/***/ (function(module) {

eval("// I hate using the vanilla console API.\nconst methods = ['log', 'info', 'warn', 'error', 'debug'];\n\nclass ConsoleWrapper {\n  group(name, callback, collapsed) {\n    const start = collapsed ? console.groupCollapsed : console.group;\n    start(name);\n\n    try {\n      callback(this);\n    } catch (e) {\n      console.error(e);\n    }\n\n    console.groupEnd();\n    return this;\n  }\n\n}\n\nfor (const method of methods) ConsoleWrapper.prototype[method] = function (...args) {\n  console[method](...args);\n  return this;\n};\n\nmodule.exports = ConsoleWrapper;\n\n//# sourceURL=webpack://abnt/./src/util/console.js?");

/***/ }),

/***/ "./src/util/constants.js":
/*!*******************************!*\
  !*** ./src/util/constants.js ***!
  \*******************************/
/***/ (function(module) {

eval("const asar = {\n  mimetype: 'application/asar',\n  headerSizeIndex: 12,\n  headerOffset: 16,\n  uInt32Size: 4\n};\nconst defaultConfig = {\n  entry: undefined,\n  topLevelAwait: true\n};\nconst bundle = {\n  configPath: '/bundle.config.json',\n  defaultConfig,\n  apiGlobal: '$bundle',\n  errors: {\n    invalidFormat: format => {\n      throw new Error(`${format} is not a valid format.`);\n    }\n  }\n};\nconst app = {\n  id: 'abnt',\n  categories: 'Viewer',\n  asarPatch: {\n    ext: {\n      mime: {\n        application: {\n          asar: [\"asar,abnt\"]\n        }\n      }\n    },\n    mime: {\n      ext: {\n        abnt: asar.mimetype,\n        asar: asar.mimetype\n      }\n    }\n  },\n  errors: {\n    pathError(path, reason) {\n      class PathError extends Error {}\n\n      const message = [, reason].join(': ');\n      return new PathError(message);\n    },\n\n    configError(reason) {\n      class ConfigError extends Error {}\n\n      return new ConfigError(reason);\n    },\n\n    prematureInjection(path) {\n      throw new Error(`Resource \"${path}\" was injected into a window before it had finished loading.`);\n    }\n\n  }\n};\nconst js = {\n  // Make async required and then use .\n  payloadWrapper: (code, async, api) => `(${async ? 'async ' : ''}${bundle.apiGlobal} => {\n  ${code}\n})(${api})`,\n  getAPI: (scope, path, index) => `${scope}.le._bundles[${index}].openScript(${JSON.stringify(path)})`,\n  mimetype: 'text/javascript'\n};\nconst nt = {\n  bootPath: '/a/boot',\n  defaultIcon: 'apps/iframe.png'\n};\nmodule.exports = {\n  asar,\n  bundle,\n  app,\n  js,\n  nt\n};\n\n//# sourceURL=webpack://abnt/./src/util/constants.js?");

/***/ }),

/***/ "./src/util/merge.js":
/*!***************************!*\
  !*** ./src/util/merge.js ***!
  \***************************/
/***/ (function(module) {

eval("const merge = function self(...objects) {\n  let [left, right] = objects;\n  right = { ...right\n  }; // Prevent overwriting source\n\n  for (const key in right) {\n    const source = right[key],\n          target = left[key];\n    if (target && source instanceof Object) right[key] = self(target, source);\n  }\n\n  const output = Object.assign(left, right);\n\n  if (objects.length > 2) {\n    return self(output, ...objects.slice(2));\n  } else {\n    objects[0] = output;\n    return output;\n  }\n};\n\nmodule.exports = merge;\n\n//# sourceURL=webpack://abnt/./src/util/merge.js?");

/***/ }),

/***/ "./src/util/promisify.js":
/*!*******************************!*\
  !*** ./src/util/promisify.js ***!
  \*******************************/
/***/ (function(module) {

eval("const promisify = original => {\n  const async = (...args) => {\n    const executor = (resolve, reject) => {\n      try {\n        original(...args, resolve);\n      } catch (error) {\n        reject(error);\n      }\n    };\n\n    return new Promise(executor);\n  };\n\n  return async;\n};\n\nmodule.exports = promisify;\n\n//# sourceURL=webpack://abnt/./src/util/promisify.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;