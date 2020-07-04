const merge = function self (...objects) {
  let [ left, right ] = objects
  
  right = { ...right } // Prevent overwriting source

  for(const key in right) {
    const source = right[key],
          target = left[key]

    if(target && source instanceof Object)
      right[key] = self(target, source)
  }

  const output = Object.assign(left, right)

  if(objects.length > 2) {
    return self(output, ...objects.slice(2))
  } else {
    objects[0] = output
    return output
  }
}

module.exports = merge