# graphql-collector

Import GraphQL queries/mutations/subscriptions of your project to one object

## Installation

npm i graphql-collector

[![npm version](https://badge.fury.io/js/graphql-collector.svg)](https://badge.fury.io/js/graphql-collector)

## Usage

```js
const { collect } = require('graphql-collector')

const graphqlSchemasDir = path.join(__dirname, 'graphql')

const schema = collect(graphqlSchemasDir)

```

Property `schema` will be object with named params, example:

```js
  const schema = {
    ListMovies: 'query ListMovies {\n  allFilms{\n    films {\n ...Movie\n    }\n  }\n}\n\nfragment Movie on Film {\n  id\n  title\n  director\n  planetConnection {\n    planets {\n      ...Place\n   }\n  }\n}\n\nfragment Place on Planet {\n  name\n  climates\n}\n'
  ...
  }
```

### Also you can use `collectToFile` function

```js
const { collectToFile } = require('graphql-collector')

const graphqlSchemasDir = path.join(__dirname, 'graphql')

const file = path.join(__dirname, 'graphql.json')

const schema = collect(graphqlSchemasDir, file)

```