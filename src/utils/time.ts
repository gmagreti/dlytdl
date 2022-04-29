export function toTime(seconds: number) {
  const h = Math.floor(seconds / (60 * 60))

  const divisor_for_minutes = seconds % (60 * 60)
  const m = Math.floor(divisor_for_minutes / 60)

  const divisor_for_seconds = divisor_for_minutes % 60
  const s = Math.ceil(divisor_for_seconds)

  return `${h ? `${h}:` : ''}${m ? `${m}:${s}` : `${s}s`}`
}
