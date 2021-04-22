const jsdoc2md = require('jsdoc-to-markdown'),
      fs = require('fs'),
      path = require('path'),
      { promisify } = require('util')

const writeFileAsync = promisify(fs.writeFile)

const constants = {
  out: path.join(__dirname, 'abnt.md'),
  options: {
    files: path.join(__dirname, '../src/Bundle/**.js')
  }
}

;(async () => {
  const markdown = await jsdoc2md.render(constants.options)

  await writeFileAsync(constants.out, markdown)
  console.log('Docs built!')
})()