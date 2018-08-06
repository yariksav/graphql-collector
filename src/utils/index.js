const fs = require('fs')
const path = require('path')


const searchAllFiles = (dir) => {
  return fs.readdirSync(dir).reduce((files, file) => {
      const name = path.join(dir, file)
      const isDirectory = fs.statSync(name).isDirectory()
      return isDirectory ? [...files, ...searchAllFiles(name)] : [...files, name]
    }, [])
}

const searchFiles = (dir, ext) => {
  ext = ext || ['.graphql', '.gql']
  return searchAllFiles(dir).filter(element => {
    var extension = path.extname(element)
    return ext && ext.indexOf(extension) >= 0
  })
}

function searchSchemas (dir, ext) {
  return searchFiles(dir, ext).reduce((contents, file) => {
    let content = fs.readFileSync(file, 'utf8')
    return [...contents, content]
  }, [])
}

module.exports = {
  searchFiles,
  searchSchemas
}