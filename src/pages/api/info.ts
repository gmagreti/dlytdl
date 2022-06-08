// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import ytdl from 'ytdl-core'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const url = req.query.url as string

    const urlRegex =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/

    const isValidUrl = urlRegex.test(url)

    if (!isValidUrl) {
      return res.status(400).send({ message: 'URL is invalid' })
    }

    const value = ytdl.getVideoID(url)

    try {
      const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${value}`)

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
