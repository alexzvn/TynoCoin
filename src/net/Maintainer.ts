import { WalletWatcher } from './WalletBalance';
import { Block } from '~/chain/Block'
import { ChainIO } from '~/chain/ChainIO'
import { Transaction, verifyTransaction } from '~/transaction/Transaction'
import { uniq } from 'lodash'

export const PAYOFF = 10 // TynoCoin

export default class Maintainer {
  constructor(private readonly chain: ChainIO) {}

  verifyNextBlock(block: Block, difficulty: number) {
    const latest = this.chain.latest()

    if (latest.hash !== block.previousHash) {
      return false
    }

    if (latest.timestamp > block.timestamp) {
      return false
    }

    if (block.height !== latest.height + 1) {
      return false
    }

    if (! /^0+/.test(block.hash)) {
      return false
    }

    const [level] = /^0+/.exec(block.hash) as string[]

    if (level.length < difficulty) {
      return false
    }

    return this.verifyTransactions(block.data as Transaction[])
  }

  async verifyTransactions(txs: Transaction[]) {
    const addresses = [
      ...new Set(txs.map(tx => tx.from)),
      ...new Set(txs.map(tx => tx.to))
    ].filter(address => address !== 'work')

    const wallets = uniq(addresses.map(address => new WalletWatcher(address)))

    await this.chain.loopThroughChain(block => {
      wallets.forEach(wallet => wallet.afterBlock(block))
    })

    for (const tx of txs) {
      if (tx.from === 'work' && tx.amount > PAYOFF) {
        return false
      }

      if (tx.from !== 'work' && !verifyTransaction(tx)) {
        return false
      }

      if (! wallets.find(wallet => wallet.canAfford(tx))) {
        return false
      }
    }

    const payoffs = txs.filter(tx => tx.from === 'work')

    if (payoffs.length > 1) {
      return false
    }

    return true
  }
}
