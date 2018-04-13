const typeDefs = `
  type User {
    id: ID!
    name: String!
    image: String!
    avatar: Avatar
  }
  type Avatar {
    url: String!
  }
  type Web3 {
    accounts: [String]
  }

  type Transaction {
    id: String
  }

  type Query {
    loggedInUser: User
    people: [User]
    web3: Web3
  }

  type Mutation {
    registerTestDomain(name: String!): Transaction
  }

  type Subscription {
    commentAdded: Transaction
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

export default typeDefs
