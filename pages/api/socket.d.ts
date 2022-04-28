import { Server as NetServer, Socket } from 'net'
import { Server as SocketIOServer } from 'socket.io'

declare module 'next' {
  interface Socket {
    server: NetServer & {
      io: SocketIOServer
    }
  }

  interface NextApiResponse {
    socket: Socket & {}
  }
}
