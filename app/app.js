import commander from 'commander'
import AppController from './controllers/app.controller'

commander
  .option('-i, --input [path]', 'Input Directory, default: current directory')
  .option('-o, --output [path]', 'Output Directory')
  .parse(process.argv);

(async () => {
  if (!commander.output) return commander.outputHelp()

  const appController = new AppController(
    commander.input,
    commander.output
  )

  try {
    await appController.organizeShows()
  } catch (err) {
    console.log(err.stack)
  }
})()
