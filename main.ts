import path = require('path')
import BlockchainNetwork from '~/BlockchainNetwork'
import { Block } from '~/chain/Block'
import { ChainIO } from '~/chain/ChainIO'
import BlockchainPeer from '~/net/BlockchainPeer'
import WalletBalance, { WalletWatcher } from '~/net/WalletBalance'

const network = new BlockchainNetwork(
  new ChainIO(path.join(__dirname, 'blockchain.dat')),
  new BlockchainPeer('main', 5431),
)

network.start().then(() => {
  network.maintain()
})
