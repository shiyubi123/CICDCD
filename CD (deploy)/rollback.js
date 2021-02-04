const { createStartMissionFunc, startMission } = require('./common')
const { remoteDirPath } = require('./config')
const prompts = require('prompts');

(async () => {
  const response = await prompts({
    type: 'confirm',
    name: 'callback',
    message: 'Do you want to callback? (y/n)'
  });
  if (response.callback) {
    const start = createStartMissionFunc(rollback)
    try {
      await startMission(start)
      process.exit(0)
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }
})();

async function rollback(runCommand, sshConfig) {
  // remove new file first
  await runCommand('rm index.html', remoteDirPath)
  // get latest file
  const result = await runCommand('ls -a -t', remoteDirPath)
  const recentfile = result.stdout.split('\n').filter(item => item.indexOf('html') > 0)[0]
  // change name to rollback
  await runCommand(`mv ${recentfile} index.html`, remoteDirPath)
  console.log(`${sshConfig.name} rollback success!`)
}
