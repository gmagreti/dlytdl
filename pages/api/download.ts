// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import ytdl from 'ytdl-core'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const io = (res?.socket as any).server?.io as Server
    const url = req.query.url as string
    const title = req.query.title as string
    const ext = req.query.ext as string

    const isValidUrl = ytdl.validateURL(url)

    if (!isValidUrl) {
      return res.status(400).send({ message: 'URL is invalid' })
    }

    const [_, urlID] = url?.split('watch?v=')

    let startTime: number

    const options: ytdl.downloadOptions =
      ext === 'mp3' ? { filter: 'audioonly', quality: 'highestaudio' } : { quality: 'highestvideo' }

    try {
      res.setHeader('Content-Disposition', `attachment; filename="${title}.${ext}"`)
      const stream = ytdl(`https://www.youtube.com/watch?v=${urlID}`, options)

      stream.once('response', () => {
        startTime = Date.now()
      })
      stream.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total
        const downloadedSeconds = (Date.now() - startTime) / 1000
        const estimated = downloadedSeconds / percent - downloadedSeconds

        io.emit('progress', {
          percent,
          downloadedSeconds,
          estimated,
        })
      })

      stream.pipe(res)
    } catch (err: any) {
      return res.status(500).send({ message: err.message })
    }
  }
}
