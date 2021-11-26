import { ec as EC } from 'elliptic'

const ec = new EC('p224')

type Base64 = string
type Hex = string


export const base64Encoder = (data: Uint8Array): Base64 => {
  return Buffer.from(data).toString('base64').replace(/=/g, '')
}

export const base64Decoder = (data: string): Hex => {
  return Buffer.from(data, 'base64').toString('hex')
}

export const generateKeypair = () => {
  const key = ec.genKeyPair()

  return {
    private: base64Encoder(Uint8Array.from(key.getPrivate().toBuffer())),
    public: base64Encoder(Uint8Array.from(key.getPublic().encode('array', true)))
  }
}

export const verifySignature = (publicKey: Hex, signature: Hex, data: Hex): boolean => {
  const key = ec.keyFromPublic(base64Decoder(publicKey), 'hex')

  return key.verify(data, signature)
}

export const createSignature = (privateKey: Hex, data: Hex): Hex => {
  const key = ec.keyFromPrivate(base64Decoder(privateKey), 'hex')

  return key.sign(data).toDER('hex')
}
