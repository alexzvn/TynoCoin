import Peer from '~/net/Peer'

const peer = new Peer('main', 5432)

peer.on('connection', (con: any, info: any) => {
  console.log('Miner: connection', con, info);
})
