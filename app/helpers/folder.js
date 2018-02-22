import mkdirp from 'mkdirp'
import * as path from 'path'

export function createDir (uri) {
  return mkdirp.sync(uri)
}

export function structureShow (outputDirURI, showName, seasonNum) {
  return path.join(outputDirURI, `${showName}/Season-${seasonNum}`)
}
