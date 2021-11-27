import BlockchainNetwork from './BlockchainNetwork'
import { Block, MiningBlock } from './chain/Block'
import { PAYOFF } from './net/Maintainer'
import { Transaction } from './transaction/Transaction'
import { Wallet } from './transaction/Wallet'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default class Miner {
  protected pendingTransactions: Transaction[] = []

  protected lastBlock: Block

  constructor(
    private readonly network: BlockchainNetwork,
    private readonly wallet: Wallet,
  ) {
    this.lastBlock = network.chainIO.latest()
  }

  public async start() {
    await sleep(3000)

    const { chainIO, peer } = this.network

    peer.on('transaction:add:request', () => {
      console.log('implement transaction request')
    })

    while (true) {
      const block = await this.mine()
      this.lastBlock = block
      this.network.chainIO.add(block)

      console.log('found block:')

      this.network.peer.broadcast({
        type: 'blockchain:add:request',
        payload: block.toObject()
      })
    }
  }

  async mine(): Promise<Block> {
    const { hash, height } = this.lastBlock

    const payoff: Transaction = {
      from: 'work',
      to: this.wallet.address,
      amount: PAYOFF,
      signature: '',
    }

    const block = new MiningBlock([payoff], hash, height + 1)

    await block.mine(5)

    return block
  }
}
