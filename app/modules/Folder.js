import readDir from 'recursive-readdir'
import * as path from 'path'

export default class Folder {
  constructor (_dirURI, _validFiles) {
    if (!_dirURI) throw new Error('Directory\'s uri is required')

    this.dirURI = _dirURI
    this.validFiles = _validFiles
  }

  getStructure () {
    return this.dirStructure
  }

  async load () {
    this.dirStructure = await readDir(this.dirURI, [
      (file, stats) => !stats.isDirectory() &&
        !this.validFiles.includes(
          path.extname(file)
        )
    ])

    return this
  }
}
