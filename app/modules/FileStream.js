import path from 'path'
import fs from 'fs-extra'
import Progress from 'progress'
import truncate from 'truncate'

export default class FileStream {
  constructor (_fileUri, _outputURI) {
    this.fileUri = _fileUri
    this.outputURI = _outputURI
    this.filename = path.basename(_fileUri)
  }

  async copy (id) {
    const fileStats = await this._fileStats(
      this.fileUri
    )
    const bar = new Progress(`    ${id}. Copying ${truncate(this.filename, 100)} [:bar] :percent`, {
      width: 30,
      total: fileStats.size
    })
    const fileStream = fs.createReadStream(this.fileUri)
    const writeStream = fs.createWriteStream(
      this.outputURI
    )

    return new Promise(resolve => {
      fileStream
        .on('data', chunk => bar.tick(chunk.length))
        .on('end', () => {
          fileStream.unpipe(writeStream)
          writeStream.close()

          resolve()
        })
        .pipe(writeStream)
    })
  }

  async exists (uri) {
    try {
      const stat = await this._fileStats(uri)

      return stat
    } catch (err) {
      return false
    }
  }

  delete (inputFolder) {
    // const parentDir = this._searchForParentDir(inputFolder)
    // const uriToDelete = parentDir !== this.filename
    //   ? parentDir
    //   : this.filename

    return this._del(
      path.join(
        inputFolder,
        this.filename // uriToDelete
      )
    )
  }

  _del (URI) {
    return fs.remove(URI)
  }

  _searchForParentDir (inputFolder) {
    return path.relative(inputFolder, this.fileUri).split('/')[0]
  }

  _fileStats (_uri) {
    return new Promise((resolve, reject) => {
      fs.stat(_uri, (err, stat) => {
        if (err) return reject(err)

        resolve(stat)
      })
    })
  }
}
