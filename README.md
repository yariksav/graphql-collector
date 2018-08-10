# graphql-collector

Import GraphQL queries/mutations/subscriptions of your project to one object

## Installation

[![npm version](https://badge.fury.io/js/graphql-collector.svg)](https://badge.fury.io/js/graphql-collector)

npm i graphql-collector

## Use as global module

npm i -g graphql-collector


then run command `graphql-collector [directory] [filename.json]`

```bash
graphql-collector graphql schema.json
```

or simply run in your project, module will try to find all graphql files in folder and save to file `schema.json`
```bash
graphql-collector
```

## Usage

```js
const { collect } = require('graphql-collector')

const graphqlSchemasDir = path.join(__dirname, 'graphql')

const schema = collect(graphqlSchemasDir).then(schema => {
  console.log(schema)
})

```



### Also you can use `collectToFile` function

```js
const { collectToFile } = require('graphql-collector')

const graphqlSchemasDir = path.join(__dirname, 'graphql')

const file = path.join(__dirname, 'graphql.json')

const schema = await collectToFile(graphqlSchemasDir, file)

```


## Example:
If yo have files
`movie-fragment.graphql`
```graphql
fragment Movie on Film {
  id
  title
  director
  planetConnection {
    planets {
      ...Place
    }
  }
}
```
`place-fragment.graphql`
```graphql
fragment Place on Planet {
  name
  climates
}
```
`listmovies.graphql`
```graphql
query ListMovies {
  allFilms {
    films {
      ...Movie
    }
  }
}
```
Result of collect method will be:

```js
  const schema = {
    ListMovies: `query ListMovies { allFilms { films { ...Movie } } } fragment 
    Movie on Film { id title director planetConnection { planets { ...Place } } } 
    fragment Place on Planet { name climates }`
  }
```