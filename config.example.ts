interface Config {
  network: {
    host: string
    port: number
    channel: string
  },

  wallet?: {
    address: string
    private: string
  }
}

// const config: Config = {
//   pool: 'https://api.axe.org/',
// }

// export default config
