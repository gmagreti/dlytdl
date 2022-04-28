// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import ytdl from 'ytdl-core'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const url = req.query.url as string
    let startTime
    try {
      res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"')
      // https://www.youtube.com/watch?v=AoFm46CDrDI&ab_channel=MomentosdoCellbit
      // 'https://www.youtube.com/watch?v=XikstmWFQmU'
      const stream = ytdl('https://www.youtube.com/watch?v=XikstmWFQmU')

      stream.once('response', () => {
        startTime = Date.now()
      })
      stream.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total
        const downloadedSeconds = (Date.now() - startTime) / 1000
        const estimatedDownloadTime = downloadedSeconds / percent - downloadedSeconds
      })

      stream.pipe(res)
    } catch (err) {
      console.log(err)
      return res.status(200).send({ ok: true })
    }
  }
}
