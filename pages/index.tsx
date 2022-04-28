import { useEffect, useState } from 'react'
import Loading from 'react-loading'
import io, { Socket } from 'socket.io-client'

import * as utils from '../utils'
import api from '../services/api'

type ProgressDataApi = {
  percent: number
  downloadedSeconds: number
  estimated: number
}

type ProgressData = {
  percent: string
  downloadedSeconds: string
  estimated: string
}

let socket: Socket

export default function App() {
  const [url, setUrl] = useState('')
  const [progress, setProgress] = useState(null as unknown as ProgressData)
  const [isLoading, setIsLoading] = useState(false)
  const [format, setFormat] = useState('mp3' as 'mp3' | 'mp4')

  useEffect(() => socketInitializer(), [])

  function socketInitializer() {
    api
      .get('/socket')
      .then((data) => {
        console.log(data)
        socket = io()

        socket.on('connect', () => {
          console.log('connected')
        })

        socket?.on('progress', (data: ProgressDataApi) => {
          setProgress({
            percent: data.percent.toLocaleString('pt-BR', { style: 'percent', maximumFractionDigits: 2 }),
            downloadedSeconds: utils.toTime(data.downloadedSeconds),
            estimated: utils.toTime(data.estimated),
          })
        })
      })
      .catch((err) => console.log(err))
  }

  async function sendURL() {
    if (isLoading || !url) return
    setIsLoading(true)

    try {
      const response = await api.get('/download', {
        responseType: 'blob',
        params: {
          url,
        },
      })
      if (format === 'mp3') {
        utils.toMP3(response.data)
      } else {
        utils.toMP4(response.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="app-content">
        <input
          name="URL"
          placeholder="https://www.youtube.com/watch?v="
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="send"
          onClick={() => sendURL()}
          disabled={isLoading || (progress && progress?.percent !== '100%')}
        >
          SEND
        </button>
        <div className="options">
          <span onClick={() => setFormat('mp3')} className={format === 'mp3' ? 'selected' : ''}>
            MP3
          </span>
          <span onClick={() => setFormat('mp4')} className={format === 'mp4' ? 'selected' : ''}>
            MP4
          </span>
        </div>
        {isLoading && (
          <div className="loading">
            <Loading type="bars" />
          </div>
        )}
        {progress && (
          <>
            <div className="app-progress">
              <p id="size">Total time : {progress?.downloadedSeconds}</p>
              <p id="estimated">Estimated: {progress?.estimated}</p>
              <p id="progress">{progress?.percent}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
