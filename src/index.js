import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './api/resolvers'
import typeDefs from './api/schema'
import { ApolloProvider } from 'react-apollo'
import pubsub from './api/pubsub'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const apolloCache = new InMemoryCache(window.__APOLLO_STATE__)

const graphqlClient = new ApolloClient({
  cache: apolloCache,
  link: new SchemaLink({ schema })
})

const payload = {
  commentAdded: {
    id: '1',
    content: 'Hello!'
  }
}

setInterval(() => {
  console.log(payload)
  const published = pubsub.publish('commentAdded', payload)
  console.log(published)
}, 2000)

ReactDOM.render(
  <ApolloProvider client={graphqlClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
