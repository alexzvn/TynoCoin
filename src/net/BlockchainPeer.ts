import { Transaction } from './../transaction/Transaction';
import { GenesisBlock } from "../chain/Block";
import Peer from "./Peer";
const mitt = require('mitt');

interface Message {
  type: string
  peer?: any
  payload: any
}

export interface AddBlockRequestMessage extends Message {
  payload: GenesisBlock
}

export interface AddBlockResponseMessage extends Message {
  payload: {
    success: boolean
    error?: 'old'|'invalid'
  }
}

export interface SyncChainRequestMessage extends Message {
  payload: {
    from: number
  }
}

export interface SyncChainResponseMessage extends Message {
  payload: {
    block: GenesisBlock
    index: number
    more: boolean
  }
}

export interface AddTransactionRequestMessage extends Message {
  payload: Transaction
}

export interface AddTransactionResponseMessage extends Message {
  payload: {
    success: boolean
    error?: 'invalid'
  }
}

export type Events = {
  'blockchain:add:request': AddBlockRequestMessage
  'blockchain:add:response': AddBlockResponseMessage
  'blockchain:sync:request': SyncChainRequestMessage
  'blockchain:sync:response': SyncChainResponseMessage
  'transaction:add:request': AddTransactionRequestMessage
  'transaction:add:response': AddTransactionResponseMessage
}

export default class BlockchainPeer extends Peer {
  protected emitter: any

  protected peers = {}
  protected conSeq = 0

  constructor(channel: string, port: number) {
    super(channel, port)
    this.emitter = mitt()
  }

  init() {
    const sw = this.sw

    sw.on('connection', (con: any, info: any) => {
      const id = info.id.toString('hex')
      console.log('connected to peer: ', id)

      this.peers[id] = con
      if (info.initiator) {
        con.setKeepAlive(true, 600)
      }

      con.on('data', (data: Buffer) => this.onData(data, con))

      con.on('close', () => {
        delete this.peers[id]
      })
    })
  }

  public on(event: keyof Events, handler: (message: Events[typeof event]) => any) {
    this.emitter.on(event, handler as any)
  }

  protected onData(payload: Buffer, peer: any) {

    const data = JSON.parse(payload.toString('utf8'))

    data.peer = peer

    this.emitter.emit(data.type, data)
  }

  public broadcast(message: Message) {
    for (const key in this.peers) {
      if (Object.prototype.hasOwnProperty.call(this.peers, key)) {
        this.peers[key].write(JSON.stringify(message))
      }
    }
  }
}
