// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import ytdl from 'ytdl-core'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const io = (res?.socket as any).server?.io as Server
    const url = req.query.url as string

    const isValidUrl = ytdl.validateURL(url)

    if (!isValidUrl) {
      return res.status(400).send({ message: 'URL is invalid' })
    }

    const [_, urlID] = url?.split('watch?v=')

    try {
      const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${urlID}`)

      return res.status(200).send({
        title: info.videoDetails.title,
        seconds: Number(info.videoDetails.lengthSeconds),
        thumbnail: info.videoDetails.thumbnails[0],
      })
    } catch (err: any) {
      return res.status(500).send({ message: err.message })
    }
  }
}
