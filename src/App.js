import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import 'ethereum-ens'

const GET_WEB3 = gql`
  query web3 {
    loggedInUser @client {
      name
    }
    web3 @client {
      accounts
    }
    people @client {
      id
      name
      image
    }
  }
`

const REGISTER_DOMAIN = gql`
  mutation registerTestDomain($name: String!) {
    registerTestDomain(name: $name) @client {
      id
    }
  }
`

const RegisterSubdomain = ({ setTx }) => {
  let input

  return (
    <Mutation mutation={REGISTER_DOMAIN}>
      {registerTestDomain => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault()
              registerTestDomain({ variables: { name: input.value } }).then(
                txId => {
                  console.log(txId)
                }
              )
              input.value = ''
            }}
          >
            <input
              ref={node => {
                input = node
              }}
            />
            <button type="submit">Register subdomain</button>
          </form>
        </div>
      )}
    </Mutation>
  )
}

class App extends Component {
  state = {
    started: false
  }
  render() {
    return (
      <Query query={GET_WEB3}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading web3</div>
          const { web3, loggedInUser, people } = data
          console.log(data)
          return (
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React</h1>
              </header>
              {console.log(data)}
              {loggedInUser ? <div>What's up {loggedInUser.name}</div> : null}

              <div>
                {web3.accounts.length > 0
                  ? `Your ETH address is ${web3.accounts[0]}`
                  : 'Unlock metamask!'}
              </div>
              <div>{console.log(people)}</div>
              <RegisterSubdomain />
            </div>
          )
        }}
      </Query>
    )
  }
}

export default App
