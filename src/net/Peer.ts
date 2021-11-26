import { randomBytes } from 'crypto'
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')

const id = randomBytes(30)

export default class Peer {
  public readonly id = randomBytes(30)

  protected sw = Swarm(defaults({ id }))

  constructor(channel: string, port: number) {
    this.sw.listen(port)
    this.sw.join(channel)
  }

  public on(event: string, callback: Function) {
    this.sw.on(event, callback)
  }
}
