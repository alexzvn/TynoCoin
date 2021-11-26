import { createHash } from 'crypto'

const sha256 = (data: string): string => {
  return createHash('sha256').update(data).digest().toString('hex')
}

export interface GenesisBlock {
  timestamp: number
  data: any
  nonce: number
  hash: string
}

export interface ChainBlock extends GenesisBlock {
  previousHash: string
}

export class Block implements ChainBlock {
  public timestamp = Date.now()

  constructor(
    public data: any,
    public readonly previousHash: string,
    public nonce: number = 0
  ) {}

  public toObject(): ChainBlock {
    return JSON.parse(this.serialize())
  }

  public preSerialize(): string {
    const { timestamp, data, nonce, previousHash } = this

    return JSON.stringify({ previousHash, data, nonce, timestamp })
  }

  public serialize(): string {
    const { timestamp, data, nonce, previousHash } = this

    return JSON.stringify({ previousHash, data, nonce, timestamp, hash: this.hash })
  }

  public static deserialize(data: string): Block {
    const { timestamp, data: dataString, nonce, previousHash } = JSON.parse(data)
    return this.fromObject({ timestamp, data: dataString, nonce, previousHash } as any)
  }

  public static fromObject(obj: ChainBlock): Block {
    const block = new Block(obj.data, obj.previousHash, obj.nonce)

    block.timestamp = obj.timestamp

    return block
  }

  get hash(): string {
    return sha256(this.preSerialize())
  }
}

export class MiningBlock extends Block {
  protected hashed?: string

  constructor(
    data: any,
    previousHash: string,
    nonce: number = 0,
  ) {
    super(data, previousHash, nonce)
  }

  public async mine(difficulty: number) {
    return this.calcHashed(difficulty)
  }

  protected calcHashed(difficulty: number): MiningBlock {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++
    }

    this.hash = sha256(this.preSerialize())

    return this
  }

  public getData () {
    return this.data
  }

  public setData(data: any) {
    this.data = data
  }

  public get hash(): string {
    return this.hashed || sha256(this.preSerialize())
  }

  public set hash(hash: string) {
    this.hashed = hash
  }

  public static fromBlock(block: Block): MiningBlock {
    return new MiningBlock('', block.previousHash, block.nonce)
  }

  public static fromChainBlock(block: ChainBlock): MiningBlock {
    return new MiningBlock('', block.previousHash, block.nonce)
  }

  public static fromSerialized(serialized: string): MiningBlock {
    const { data, nonce, previousHash } = JSON.parse(serialized)

    return new MiningBlock('', previousHash, nonce)
  }
}
