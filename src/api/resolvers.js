import 'isomorphic-fetch'
import getWeb3, { getAccounts } from './web3'
import { getFifsRegistrarContract } from './ens'
import pubsub from './pubsub'
import { withFilter } from 'graphql-subscriptions'

const users = {
  //singleton could hold local state
  doug: {
    id: 8,
    name: 'Doug Funnie',
    url: 'http://doug.wikia.com/wiki/Doug_Funnie',
    avatar: {
      url:
        'https://vignette.wikia.nocookie.net/doug/images/4/42/Doug01.jpeg/revision/latest'
    }
  },
  patty: {
    id: 17,
    name: 'Patty Mayonnaise',
    url: 'http://doug.wikia.com/wiki/Patti_Mayonnaise',
    avatar: {
      url:
        'https://vignette.wikia.nocookie.net/doug/images/4/41/Patti_2.jpg/revision/latest'
    }
  }
}

const resolvers = {
  Web3: {
    accounts: () => getAccounts()
  },
  Query: {
    loggedInUser: () => users.doug, // could be local state
    web3: () => getWeb3(), // data from the blockchain
    people: () =>
      // could call to any backend or REST api
      fetch('https://emerald-ink.glitch.me/people')
        .then(res => res.json())
        .then(people =>
          people.map(person => ({
            name: person.name,
            id: person.id,
            image: person.image
          }))
        )
  },

  Mutation: {
    registerTestDomain: async (object, { name }, context) => {
      const { registrar, web3 } = await getFifsRegistrarContract()
      const accounts = await getAccounts()
      // const canRegister =
      //   new Date() <
      //   new Date(registrar.expiryTimes(web3.sha3(name)).toNumber() * 1000)
      console.log(accounts, registrar, web3)
      console.log(name)

      return new Promise((resolve, reject) => {
        registrar.register(
          web3.sha3(name),
          accounts[0],
          {
            from: accounts[0]
          },
          (error, txId) => {
            if (true) {
              resolve(txId)
            } else {
              reject(error)
            }
          }
        )
      })
    }
  },

  Subscription: {
    commentAdded: {
      // resolve: payload => {
      //   console.log(payload)
      //   return {
      //     id: '45678'
      //   }
      // },
      subscribe: withFilter(
        () => pubsub.asyncIterator('commentAdded'),
        (payload, variables) => {
          console.log('something happening', payload)
          return payload
        }
      )
    }
  }
}

export default resolvers
