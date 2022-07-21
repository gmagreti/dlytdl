
import child_process from 'child_process'
import ffmpeg from 'ffmpeg-static'

export class FfmpegHandler {
  public static convertVideo(
    videoStream: any,
    audioStream: any,
    videoName: string
  ): {
    videoPath: string
    ffmpegProcess: any
  } {
    const videoPath = `static/${videoName}.mp4`
    const ffmpegProcess = child_process.spawn(
      ffmpeg,
      [
        '-loglevel',
        '8',
        '-hide_banner',
        '-i',
        'pipe:3',
        '-i',
        'pipe:4',
        '-map',
        '0:a',
        '-map',
        '1:v',
        '-c:v',
        'copy',
        '-f', 
        'matroska', 
        'pipe:5',
        videoPath
      ],
      {
        windowsHide: true,
        stdio: [
          'inherit',
          'inherit',
          'inherit',
          'pipe',
          'pipe',
          'pipe'
        ]
      }
    )

    audioStream.pipe(ffmpegProcess.stdio[4])
    videoStream.pipe(ffmpegProcess.stdio[3])

    return {
      ffmpegProcess,
      videoPath: videoPath
    }
  }
}
