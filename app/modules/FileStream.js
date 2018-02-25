import * as path from 'path'
import * as fs from 'fs'
import Progress from 'progress'

export default class FileStream {
  constructor (_fileUri) {
    this.fileUri = _fileUri
    this.filename = path.basename(_fileUri)
  }

  async copy (toUri, id) {
    const fileStats = await this._fileStats(
      this.fileUri
    )
    const bar = new Progress(`    ${id}. Copying ${this.filename} [:bar] :percent`, {
      width: 30,
      total: fileStats.size
    })
    const fileStream = fs.createReadStream(this.fileUri)
    const writeStream = fs.createWriteStream(
      path.join(toUri, this.filename)
    )

    await new Promise(resolve => {
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
      return this._fileStats(uri)
    } catch (err) {
      return false
    }
  }

  delete () {
    // unlink
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
