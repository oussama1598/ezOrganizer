import * as path from 'path'
import * as episodeHelper from 'helpers/episode'
import * as folderHelper from 'helpers/folder'
import FileStream from 'modules/FileStream'

export default class Episode {
  constructor (_URI) {
    this.fileUri = _URI
    this.episodeData = {}
    this.stream = new FileStream(_URI)

    this._parseData()
  }

  async existsInDistination (outpuDirURI) {
    const distFolder = folderHelper.structureShow(
      outpuDirURI,
      this.episodeData.showName,
      this.episodeData.season
    )
    const outputFile = path.join(
      distFolder,
      this.episodeData.filename
    )
    const exists = await this.stream.exists(outputFile)

    return exists
  }

  getEpisodeData () {
    return this.episodeData
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

    this.episodeData = {
      filename,
      showName,
      episode,
      season
    }
  }
}
