import { getNamehash, watchEvent } from './ens'

export async function watchRegistryEvent(eventName, name, callback) {
  let namehash = await getNamehash(name)
  let event = await watchEvent(
    { contract: 'ENS', eventName },
    { node: namehash },
    { fromBlock: 'latest' },
    callback
  )
  return event
}
