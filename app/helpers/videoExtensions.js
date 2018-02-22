import videoExtensions from 'video-extensions'

export function getVideoExtensions () {
  return videoExtensions
}

export function getFilterVideosList () {
  return getVideoExtensions()
    .map(ext => `.${ext}`)
}
