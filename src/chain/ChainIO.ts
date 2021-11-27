import fs from 'fs'
import { Chain } from './Chain'
import { createInterface } from 'readline'
import { Block } from './Block'

export class ChainIO {
  protected chain = new Chain([])

  protected ready = false

  constructor (public readonly blockchainFile: string) {
    fs.existsSync(this.blockchainFile) || fs.writeFileSync(this.blockchainFile, '')
  }

  public async load () {
    await this.loopThroughChain(block => {
      this.chain.push(block)
    })

    this.ready = true
  }

  public async loadFromFile (file: string) {
    fs.writeFileSync(this.blockchainFile, '')

    await this.loopThroughChain(block => {
      this.chain.push(block)
      this.append(block)
    }, file)

    this.ready = true
  }

  public async loopThroughChain (callback: (block: Block) => any, file?: string) {
    const stream = fs.createReadStream(file || this.blockchainFile)

    const rl = createInterface({
      input: stream,
      crlfDelay: Infinity
    })

    for await (const line of rl) {
      if (line.trim().length === 0) continue

      const block = Block.deserialize(line)
      callback(block)
    }

    stream.close()
  }

  public add(block: Block) {
    if (!this.ready) {
      throw new Error('Chain is not ready')
    }

    console.log('Adding block', block.hash);

    this.chain.push(block)
    this.append(block)
  }

  latest() {
    return this.chain.getLast()
  }

  get length () {
    return this.chain.length
  }

  protected append (block: Block) {
    fs.appendFileSync(this.blockchainFile, block.serialize() + '\n')
  }
}
