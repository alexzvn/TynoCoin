import { ChainIO } from '~/chain/ChainIO';
import { Transaction } from '~/transaction/Transaction';
import { Block } from '~/chain/Block';

export class WalletWatcher {
  protected balance = 0

  constructor(public readonly address: string) {}

  afterBlock(block: Block) {
    const txs = block.data as Transaction[]

    txs.forEach(tx => {
      if (tx.to === this.address) {
        this.balance += tx.amount
      }

      if (tx.from === this.address) {
        this.balance -= tx.amount
      }
    })
  }

  canAfford(tx: Transaction): boolean {
    return this.balance >= tx.amount
  }

  getBalance(): number {
    return this.balance
  }
}

export default class WalletBalance {
  constructor(
    public readonly chainIO: ChainIO,
    public readonly watcher: WalletWatcher,
  ) {}

  async getBalance() {
    await this.chainIO.loopThroughChain(block => this.watcher.afterBlock(block))

    return this.watcher.getBalance()
  }
}
