const constants = require('../util/constants'),
      PathUtil = require('../util/PathUtil')

const { headerOffset, headerSizeIndex, uInt32Size } = constants.asar,
      { errors } = constants.app

// Essentially just ripped from the chromium-pickle-js source, thanks for
// doing my math homework.
const alignInt = (i, alignment) =>
  i + (alignment - (i % alignment)) % alignment

const crawlHeader = function self(files, dirname) {
  const prefix = itemName =>
    (dirname ? dirname + '/' : '') + itemName

  let children = []

  for(const filename in files) {
    const extraFiles = files[filename].files
    
    if(extraFiles) {
      const extra = self(extraFiles, filename)

      children = children.concat(extra)
    }
  
    children.push(filename)
  }

  return children.map(prefix)
}

class AsarHandler {
  constructor(buffer) {
    if(buffer.length > Number.MAX_SAFE_INTEGER)
      throw new Error('This file is too big for AsarHandler to safely work with, sorry for the inconvenience.')

    const headerSize = buffer.readUInt32LE(headerSizeIndex),
          // Pickle wants to align the headers so that the payload length is
          // always a multiple of 4. This means you'll get "padding" bytes
          // after the header if you don't round up the stored value.
          //
          // IMO why not just store the aligned int and have us trim the json,
          // but it's whatever.
          headerEnd = headerOffset + headerSize,
          filesOffset = alignInt(headerEnd, uInt32Size),
          rawHeader = buffer.slice(headerOffset, headerEnd).toString('utf-8'),
          files = buffer.slice(filesOffset)

    this.header = JSON.parse(rawHeader)
    this.files = files
    this.contents = crawlHeader(this.header.files)
  }

  // Only takes posix-like paths
  find(path) {
    const navigate = (currentItem, navigateTo) => {
      if(currentItem.files) {
        const nextItem = currentItem.files[navigateTo]

        if(!nextItem) {
          if(path == '/') // This breaks it lol
            return this.header
          
          throw errors.pathError(path, `${navigateTo} could not be found.`)
        }

        return nextItem
      } else {        
        throw errors.pathError(path, `${navigateTo} is not a directory.`)
      }
    }

    return PathUtil
      .normalize(path)
      .split('/')
      .reduce(navigate, this.header)
  }

  get(path) {
    const { offset, size } = this.find(path),
          offsetInt = parseInt(offset)

    return this.files.slice(offsetInt, offsetInt + size)
  }

  exists(path) {
    const normalizedPath = PathUtil.normalize(path)

    return this.contents.includes(normalizedPath)
  }
}

module.exports = AsarHandler