import Folder from 'modules/Folder'
import * as videoExtensions from 'helpers/videoExtensions'
import * as episode from 'helpers/episode'
import Episode from 'modules/Episode'
import Show from 'modules/Show'
import * as folderHelper from 'helpers/folder'

export default class AppController {
  constructor (_inputDir = process.cwd(), _outputDir = null) {
    this.inputDir = _inputDir
    this.outputDir = _outputDir
  }

  async organizeShows () {
    const parseFolder = await this._processFolder()

    if (!parseFolder.totalFiles) return console.log('    All set no files to copy')

    console.log(`    Copying a total of ${parseFolder.totalFiles} files`)

    this._createDirStructure(
      this.outputDir,
      parseFolder.showCollection
    )

    await this._copyFiles(
      this.outputDir,
      parseFolder.showCollection
    )
  }

  async _processFolder () {
    const inputDir = await new Folder(
      this.inputDir,
      videoExtensions.getFilterVideosList()
    ).load()
    const allEpisodes = inputDir.getStructure()
      .filter(file => episode.isEpisode(file))
      .map(file => new Episode(file))

    const episodes = await Promise.all(
      allEpisodes.map(
        episode => episode.existsInDistination(this.outputDir)
          .then(exists => exists ? null : episode)
      )
    ).then(episodes => episodes.filter(episode => episode))

    const showCollection = episodes.reduce((showCollection, episode) => {
      const episodeData = episode.getEpisodeData()
      const showName = episodeData.showName

      const show = showCollection.get(showName) ||
        showCollection.set(
          showName,
          new Show(showName)
        ).get(showName)

      show.addEpisode(episode)

      return showCollection
    }, new Map())

    return {
      showCollection,
      totalFiles: episodes.length
    }
  }

  _createDirStructure (outputDirURI, showCollection) {
    for (const [showName, show] of showCollection) {
      for (const [seasonNum] of show.seasons) {
        folderHelper.createDir(
          folderHelper.structureShow(
            outputDirURI,
            showName,
            seasonNum
          )
        )
      }
    }
  }

  async _copyFiles (outputDirURI, showCollection) {
    let count = 1

    for (const [showName, show] of showCollection) {
      for (const [seasonNum, season] of show.seasons) {
        for (const episode of season.values()) {
          const outputURI = folderHelper.structureShow(
            outputDirURI,
            showName,
            seasonNum
          )

          await episode.stream.copy(
            outputURI,
            count
          )

          count++
        }
      }
    }
  }
}
