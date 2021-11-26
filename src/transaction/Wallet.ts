import { Transaction, createTransaction } from './Transaction'
import { generateKeypair } from '~/Keypair'

export type Address = string|'work'

export interface WalletContract {
  address: Address
  publicKey: string
  secretKey: string
}

export const generateWallet = (): Wallet => {
  const pair = generateKeypair()

  return new Wallet(pair.public, pair.private)
}

export class Wallet implements WalletContract {
  constructor( 
    public readonly publicKey: string,
    public readonly secretKey: string,
  ) {}

  get address(): Address {
    return this.publicKey
  }

  send(to: Address, amount: number): Transaction {
    return createTransaction(this, to, amount)
  }

  static fromKeyPair(keyPair: { public: string, private: string }) {
    return new Wallet(keyPair.public, keyPair.private)
  }
}
