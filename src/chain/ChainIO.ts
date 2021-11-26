import fs from 'fs'
import { Chain } from './Chain'
import { createInterface } from 'readline'
import { Block } from './Block'

export class ChainIO {
  protected chain = new Chain([])

  protected writer: fs.WriteStream

  protected ready = false

  constructor (public readonly blockchainFile: string) {
    fs.existsSync(this.blockchainFile) || fs.writeFileSync(this.blockchainFile, '')

    this.writer = fs.createWriteStream(this.blockchainFile, { flags: 'a' })
  }

  public async load () {
    await this.loopThroughChain(block => {
      this.add(block)
    })

    this.ready = true
  }

  public async loadFromFile (file: string) {
    fs.writeFileSync(this.blockchainFile, '')

    await this.loopThroughChain(block => {
      this.add(block)
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
  }

  public add(block: Block): boolean {
    if (!this.ready) {
      throw new Error('Chain is not ready')
    }

    this.chain.push(block)

    if (this.chain.isValid()) {
      this.writer.write(block.serialize() + '\n')
      return true
    }

    this.chain.pop()
    return false
  }

  public addWithFile(block: Block) {
    this.chain.push(block)
    this.writer.write(block.serialize() + '\n')
  }
}
