import * as path from 'path'
import * as episodeHelper from 'helpers/episode'
import * as folderHelper from 'helpers/folder'
import FileStream from 'modules/FileStream'

export default class Episode {
  constructor (_URI, _outputURI) {
    this.fileUri = _URI
    this.episodeData = this._parseData()
    this.outpuDirURI = folderHelper.structureShow(
      _outputURI,
      this.episodeData.showName,
      this.episodeData.season
    )
    this.outputFileName = this._outputFileName()
    this.stream = new FileStream(
      _URI,
      this.outputFileName
    )
  }

  getEpisodeData () {
    return this.episodeData
  }

  async allowedToCopy () {
    const distinationStat = await this._existsInDistination()

    if (!distinationStat) return true

    return this._notInputSameAsOutput(distinationStat)
  }

  async _notInputSameAsOutput (stat) {
    const fileInputSize = await this.stream._fileStats(
      this.fileUri
    ).then(stat => stat.size)

    return fileInputSize !== stat.size
  }

  async _existsInDistination () {
    return this.stream.exists(
      this.outputFileName
    )
  }

  _outputFileName () {
    return path.join(
      this.outpuDirURI,
      this.episodeData.filename
    )
  }

  _parseData () {
    const filename = path.basename(this.fileUri)
    const episodeDetails = filename.match(
      episodeHelper.matchRgx
    )[0]
    const showName = filename.slice(
      0,
      filename.indexOf(episodeDetails) - 1
    ).trim()
    const episode = parseInt(
      episodeDetails.slice(
        episodeDetails.toLowerCase().indexOf('e') + 1,
        episodeDetails.length
      )
    )
    const season = parseInt(
      episodeDetails.slice(
        0,
        episodeDetails.toLowerCase().indexOf('e')
      ).replace(/s/ig, '')
    )

    return {
      filename,
      showName,
      episode,
      season
    }
  }
}
