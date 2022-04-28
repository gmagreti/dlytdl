// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ytdl from 'ytdl-core'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const url = req.query.url as string
    const ext = req.query.ext as string
    const [http, urlID] = url?.split('watch?v=')

    let startTime: number

    try {
      res.setHeader('Content-Disposition', `attachment; filename="video.${ext}"`)
      const stream = ytdl(`https://www.youtube.com/watch?v=${urlID}`, { ...(ext === 'mp3' && { filter: 'audioonly' }) })

      stream.once('response', () => {
        startTime = Date.now()
      })
      stream.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total
        const downloadedSeconds = (Date.now() - startTime) / 1000
        const estimatedDownloadTime = downloadedSeconds / percent - downloadedSeconds
        console.log(percent)
      })

      stream.pipe(res)
    } catch (err: any) {
      return res.status(200).send({ ok: true })
    }
  }
}
