import * as path from 'path'

export const matchRgx = /(s\d{2,}e\d{2,})|(\d{1,}\x{2,})/i

export function isEpisode (uri) {
  return matchRgx.test(
    path.basename(uri)
  )
}
