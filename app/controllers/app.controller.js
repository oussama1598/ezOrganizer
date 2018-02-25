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
      parseFolder.showCollection
    )

    await this._copyFiles(
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
      .map(file => new Episode(
        file,
        this.outputDir
      ))

    const episodes = await Promise.all(
      allEpisodes.map(
        episode => episode.allowedToCopy()
          .then(allowed => allowed ? episode : null)
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

  _createDirStructure (showCollection) {
    for (const show of showCollection.values()) {
      for (const season of show.seasons.values()) {
        const outputDir = [...season.values()][0].outpuDirURI

        folderHelper.createDir(
          outputDir
        )
      }
    }
  }

  async _copyFiles (showCollection) {
    let count = 1

    for (const show of showCollection.values()) {
      for (const season of show.seasons.values()) {
        for (const episode of season.values()) {
          await episode.stream.copy(count)
          await episode.stream.delete(
            this.inputDir
          )

          count++
        }
      }
    }
  }
}
