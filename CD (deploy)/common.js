const { NodeSSH } = require('node-ssh');
const { sshConfigs } = require('./config')

async function connectSSH(sshConfig) {
  const ssh = new NodeSSH()
  try {
    await ssh.connect(sshConfig)
    console.log(`${sshConfig.name} connect success`)
  } catch (err) {
    console.log(`connect failed ${err}`)
    process.exit(1)
  }
  return ssh
}

function createRunCommandFunc(ssh) {
  return async function runCommand(command, remotePath) {
    return await ssh.execCommand(command, {
      cwd: remotePath
    })
  }
}

function createStartFunc(missionFunc) {
  return async function start(sshConfig) {
    const ssh = await connectSSH(sshConfig)
    const runCommand = createRunCommandFunc(ssh)
    await missionFunc(runCommand, sshConfig, ssh)
  }
}

function startMission(start) {
  let missionArray = []
  sshConfigs.forEach(sshConfig => {
    missionArray.push(start(sshConfig))
  })
  return Promise.all(missionArray)
}

module.exports = { createStartFunc, startMission }

