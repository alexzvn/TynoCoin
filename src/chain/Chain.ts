import { Block } from './Block'

export class Chain {
  constructor(
    protected readonly blocks: Block[] = []
  ) {}

  public get(): Block[] {
    return this.blocks;
  }

  public getLast(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  public shift() {
    return this.blocks.shift()
  }

  public pop() {
    return this.blocks.pop()
  }

  public push(block: Block): void {
    this.blocks.push(block)
  }

  public isValid(): boolean {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }

    return true
  }

  get length(): number {
    return this.blocks.length
  }
}
