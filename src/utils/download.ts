export function toMP3(stream, title: string) {
  const file = window.URL.createObjectURL(new File([stream], `${title}.mp3`, { type: 'audio/mpeg' }))
  const link = document.createElement('a')
  link.href = file
  link.setAttribute('download', `${title}.mp3`)
  document.body.appendChild(link)
  link.click()
}

export function toMP4(stream, title: string) {
  const file = window.URL.createObjectURL(new File([stream], `${title}.mp4`, { type: 'video/mp4' }))
  const link = document.createElement('a')
  link.href = file
  link.setAttribute('download', `${title}.mp4`)
  document.body.appendChild(link)
  link.click()
}
