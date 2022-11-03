export function getConfig() {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
  const networkId = process.env.REACT_APP_NETWORK_ID
  const nodeUrl = process.env.REACT_APP_NODE_URL
  const walletUrl = process.env.REACT_APP_WALLET_URL
  const helperUrl = process.env.REACT_APP_HELPER_URL

  if (!contractAddress) {
    throw new Error('REACT_APP_CONTRACT_ADDRESS was not provided in .env')
  }

  if (!networkId) {
    throw new Error('REACT_APP_NETWORK_ID was not provided in .env')
  }

  if (!nodeUrl) {
    throw new Error('REACT_APP_NODE_URL was not provided in .env')
  }

  if (!walletUrl) {
    throw new Error('REACT_APP_WALLET_URL was not provided in .env')
  }

  if (!helperUrl) {
    throw new Error('REACT_APP_HELPER_URL was not provided in .env')
  }

  return {
    contractAddress,
    networkId,
    nodeUrl,
    walletUrl,
    helperUrl
  }
}

