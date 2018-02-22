export default class Show {
  constructor (_showName) {
    this.showName = _showName
    this.seasons = new Map()
  }

  addEpisode (episode) {
    const episodeNum = episode.episodeData.episode
    const seasonNum = episode.episodeData.season

    const season = this.seasons.get(seasonNum) ||
      this.seasons.set(
        seasonNum,
        new Map()
      ).get(seasonNum)

    season.set(episodeNum, episode)
  }
}
