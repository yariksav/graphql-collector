#!/usr/bin/env node

var { collectToFile } = require('../src/index.js')
const path = require('path')

// Delete the 0 and 1 argument (node and script.js)
var args = process.argv.splice(process.execArgv.length + 2);

const dir = path.join(process.cwd(), args[0] || '')
const file = path.join(process.cwd(), args[1] || 'schema.json')

console.info(`Collect graphql files from directory "${dir}"`)

collectToFile(dir, file).then(() => {
  console.info(`Saved to file "${file}"`)
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(0)
})