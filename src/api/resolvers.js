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
    },
    __typename: 'User'
  },
  patty: {
    id: 17,
    name: 'Patty Mayonnaise',
    url: 'http://doug.wikia.com/wiki/Patti_Mayonnaise',
    avatar: {
      url:
        'https://vignette.wikia.nocookie.net/doug/images/4/41/Patti_2.jpg/revision/latest'
    },
    __typename: 'User'
  }
}

const resolvers = {
  Web3: {
    accounts: () => getAccounts()
  },
  Query: {
    loggedInUser: () => users.doug, // could be local state
    web3: async (_, variables, context) => {
      try {
        return {
          ...(await getWeb3()),
          __typename: 'Web3'
        }
      } catch (e) {
        console.error(e)
        return null
      }
    },
    async people() {
      const response = await fetch('https://emerald-ink.glitch.me/people')
      const people = await response.json()

      return people.map(person => ({
        ...person,
        __typename: 'thing'
      }))
    }
    // could call to any backend or REST api
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
  }
}

export default resolvers
