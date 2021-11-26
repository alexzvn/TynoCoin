declare module 'p2p-node' {
  export class Peer {
    constructor(host: string);
    on(event: string, callback: Function): void;
    connect(port: number, host: string): void;
    send(data: any): void;
    disconnect(): void;
  }
}
