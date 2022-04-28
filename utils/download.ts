export function toMP3(stream) {
  const file = window.URL.createObjectURL(new File([stream], 'video.mp3', { type: 'audio/mpeg' }))
  const link = document.createElement('a')
  link.href = file
  link.setAttribute('download', 'video.mp3')
  document.body.appendChild(link)
  link.click()
}

export function toMP4(stream) {
  const file = window.URL.createObjectURL(new File([stream], 'video.mp4', { type: 'video/mp4' }))
  const link = document.createElement('a')
  link.href = file
  link.setAttribute('download', 'video.mp4')
  document.body.appendChild(link)
  link.click()
}
