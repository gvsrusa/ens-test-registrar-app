import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { Query, Mutation, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import 'ethereum-ens'

// class DataStoreProvider extends React.Component {
//   state = { theme: 'light' }
//   render() {
//     return (
//       <ThemeContext.Provider value={this.state.theme}>
//         {this.props.children}
//       </ThemeContext.Provider>
//     )
//   }
// }

const GET_WEB3 = gql`
  query web3 {
    loggedInUser {
      name
    }
    web3 {
      accounts
    }
  }
`

const REGISTER_DOMAIN = gql`
  mutation registerTestDomain($name: String!) {
    registerTestDomain(name: $name) {
      id
    }
  }
`

const COMMENTS_SUBSCRIPTION = gql`
  subscription commentAdded($randomString: String) {
    commentAdded(randomString: $randomString) {
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
      <React.Fragment>
        <Query query={GET_WEB3}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading web3</div>
            const { web3, loggedInUser } = data
            return (
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Welcome to React</h1>
                </header>
                <div>What's up {loggedInUser.name}</div>
                <div>
                  {web3.accounts.length > 0
                    ? `Your ETH address is ${web3.accounts[0]}`
                    : 'Unlock metamask!'}
                </div>
                <RegisterSubdomain />
              </div>
            )
          }}
        </Query>
        {this.state.started ? (
          <Subscription
            subscription={COMMENTS_SUBSCRIPTION}
            variables={{ randomString: '12345' }}
          >
            {props => {
              const { data, loading } = props
              console.log(props)
              return (
                <h4>
                  New comment:{' '}
                  {!loading && data.commentAdded && data.commentAdded.id}
                </h4>
              )
            }}
          </Subscription>
        ) : (
          <button onClick={() => this.setState({ started: true })}>
            Start
          </button>
        )}
      </React.Fragment>
    )
  }
}

export default App
