const { createStartFunc, startMission } = require('./common')
const { remoteDirPath } = require('./config')

const start = createStartFunc(rollback)
startMission(start).then(res => {
  process.exit(0)
}).catch(error => {
  console.log(error)
  process.exit(1)
})

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