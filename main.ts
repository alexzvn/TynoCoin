import Peer from '~/net/Peer'

const peer = new Peer('main', 5431)

peer.on('connection', (con: any, info: any) => {
  console.log('Main: connection', con, info);
})

