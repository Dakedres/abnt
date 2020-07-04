const path = require('path'),
      merge = require('./src/util/merge')

let env = /^--([a-z]+)$/i.exec(process.argv[2])
env = env ? env[1] : 'dev'

console.log('fukin helpl')

const config = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'abnt.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/i,
        exclude: /node_modules|bower_components/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [ '@babel/preset-env' ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }
    ]
  }
}

const environments = {
  'dev': {
    mode: 'development',
    output: {
      filename: 'abnt.dev.js'
    }
  },
  'prod': {
    mode: 'production'
  }
}

module.exports = merge(config, environments[env])