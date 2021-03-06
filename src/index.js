const gql = require('graphql-tag')
const { print } = require('graphql/language/printer')
const { searchSchemas } = require('./utils')
const fs = require('fs')

function splitSchemaToObject (doc) {
  var definitionRefs = {}
  // Collect any fragment/type references from a node, adding them to the refs Set
  function collectFragmentReferences(node, refs) {
    if (node.kind === "FragmentSpread") {
      refs.add(node.name.value)
    } else if (node.kind === "VariableDefinition") {
      var type = node.type
      if (type.kind === "NamedType") {
        refs.add(type.name.value)
      }
    } else if (node.kind === "InputObjectTypeDefinition") {
      return
    }

    if (node.selectionSet) {
      node.selectionSet.selections.forEach(function(selection) {
        collectFragmentReferences(selection, refs)
      })
    }

    if (node.variableDefinitions) {
      node.variableDefinitions.forEach(function(def) {
        collectFragmentReferences(def, refs)
      })
    }

    if (node.definitions) {
      node.definitions.forEach(function(def) {
        collectFragmentReferences(def, refs)
      })
    }
  }

  (function extractReferences() {
    (doc.definitions || []).forEach(function(def) {
      if (def.name) {
        var refs = new Set()
        collectFragmentReferences(def, refs)
        definitionRefs[def.name.value] = refs
      }
    })
  })()

  function findOperation(doc, name) {
    for (var i = 0; i < doc.definitions.length; i++) {
      var element = doc.definitions[i]
      if (element.name && element.name.value == name) {
        return element
      }
    }
  }

  function oneQuery(doc, operationName) {
    // Copy the DocumentNode, but clear out the definitions
    var newDoc = {
      kind: doc.kind,
      definitions: [findOperation(doc, operationName)]
    }
    if (doc.hasOwnProperty("loc")) {
      newDoc.loc = doc.loc
    }

    // Now, for the operation we're running, find any fragments referenced by
    // it or the fragments it references
    var opRefs = definitionRefs[operationName] || new Set()
    var allRefs = new Set()
    var newRefs = new Set(opRefs)
    while (newRefs.size > 0) {
      var prevRefs = newRefs
      newRefs = new Set()

      prevRefs.forEach(function(refName) {
        if (!allRefs.has(refName)) {
          allRefs.add(refName)
          var childRefs = definitionRefs[refName] || new Set()
          childRefs.forEach(function(childRef) {
            newRefs.add(childRef)
          })
        }
      })
    }

    allRefs.forEach(function(refName) {
      var op = findOperation(doc, refName)
      if (op) {
        newDoc.definitions.push(op)
      }
    })

    return newDoc
  }


  let schema = {}
  for (const op of doc.definitions) {
    if (op.kind === "OperationDefinition") {
      if (!op.name) {
        if (operationCount > 1) {
          throw "Query/mutation names are required for a document with multiple definitions"
        } else {
          continue
        }
      }

      const opName = op.name.value
      let queryStr = print(oneQuery(doc, opName))
      if (queryStr) {
        queryStr = queryStr
          .replace(/(\r\n\t|\n|\r\t)/gm, ' ')
          .replace(/ +/g, ' ')
          .trim()
        schema[opName] = queryStr
      }
    }
  }
  const ordered = {};
  Object.keys(schema).sort().forEach(function(key) {
    ordered[key] = schema[key]
  })
  return ordered
}

const searchSchema = (dir, ext) => {
  return searchSchemas(dir, ext).join("\n")
}

const collect = (dir, ext) => {
  return new Promise((resolve) => {
    const schema = searchSchema(dir, ext)
    if (!schema || schema.trim() === '') {
      resolve({})
      return 
    }
    const gschema = gql(schema)
    resolve(splitSchemaToObject(gschema))
  })
}

const collectToFile = (dir, file, ext) => {
  return new Promise(function(resolve, reject) {
    collect(dir, ext).then( schema => {

      const jsonStr = JSON.stringify(schema, undefined, 2)
      fs.writeFile(file, jsonStr, 'utf-8', function(err) {
          if (err) reject(err)
          else resolve(schema)
      })
    })
  })
  // fs.writeFile(file, , )
}

module.exports = {
  collect,
  collectToFile,
  searchSchema,
  splitter: splitSchemaToObject
}
