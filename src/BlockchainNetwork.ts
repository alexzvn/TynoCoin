import { Block, ChainBlock } from './chain/Block'
import { ChainIO } from './chain/ChainIO'
import BlockchainPeer, { AddBlockRequestMessage, AddBlockResponseMessage } from './net/BlockchainPeer'
import Maintainer from './net/Maintainer'

export default class BlockchainNetwork {
  protected maintainer: Maintainer

  constructor(
    public readonly chainIO: ChainIO,
    public readonly peer: BlockchainPeer,
  ) {
    this.maintainer = new Maintainer(chainIO)
  }

  public async start() {
    await this.chainIO.load()
    this.peer.init()
  }

  public maintain() {
    this.peer.on('blockchain:add:request', async (request) =>{
      console.log('Checking block...');

      const block = Block.fromObject(request.payload as ChainBlock)

      const verify = await this.maintainer.verifyNextBlock(block, 5)

      const response: AddBlockResponseMessage = {
        type: 'blockchain:add:response',
        payload: {
          success: verify,
          error: verify ? undefined : 'invalid',
        },
      }

      verify && this.chainIO.add(block)
      request.peer.write(response)
    })
  }
}
