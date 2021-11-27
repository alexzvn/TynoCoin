import path = require('path')
import BlockchainNetwork from '~/BlockchainNetwork'
import { ChainIO } from '~/chain/ChainIO'
import BlockchainPeer from '~/net/BlockchainPeer'
import Miner from '~/Miner'
import { generateWallet, Wallet } from '~/transaction/Wallet'

const network = new BlockchainNetwork(
  new ChainIO(path.join(__dirname, 'miner.dat')),
  new BlockchainPeer('main', 5432),
)

const wallet = new Wallet(
  'A6FLx/9ZktGkDuU5dzweVYX2KkbhAHlt5KOMpPc',
  'QH+dCx2rSl/l+1/ljbqUO1mJTDGeKgFSOguSYg'
)

network.start().then(() => {
  const miner = new Miner(network, wallet)

  console.log('start miner')
  miner.start()
})
