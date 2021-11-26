import { Address, Wallet } from  './Wallet'
import { verifySignature, createSignature } from '~/Keypair'

export type TynoCoin = number

export interface TransferCoin {
  from: Address
  to: Address
  amount: TynoCoin
}

export interface Transaction extends TransferCoin {
  signature: string
}

export const serialize = (tx: TransferCoin): string => {
  return JSON.stringify({
    from: tx.from,
    to: tx.to,
    amount: tx.amount,
  })
}

export const verifyTransaction = (transaction: Transaction): boolean => {
  const { signature, from } = transaction

  try {
    return verifySignature(from, signature, serialize(transaction))
  }

  catch (any) {
    return false
  }
}

export const createTransaction = (wallet: Wallet, to: Address, amount: TynoCoin): Transaction => {
  const tx = {
    from: wallet.address,
    to: to,
    amount: amount,
  }

  return {
    ...tx,
    signature: createSignature(wallet.secretKey, serialize(tx)),
  }
}
