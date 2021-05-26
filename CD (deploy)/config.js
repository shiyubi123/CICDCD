const proConfigs = [
  {
    name: '',
    host: '',
    port: 8080,
    username: '',
    password: '',
    remoteDirPath: ''
  }
]
const uatConfigs = [
  {
    name: '',
    host: '',
    port: 8080,
    username: '',
    password: '',
    remoteDirPath: ''
  }
]

let sshConfigs, remoteFilePath, remoteDirPath
handleConfig()
function handleConfig() {
  if (process.argv[2] === 'uat') {
    sshConfigs = uatConfigs
  } else {
    sshConfigs = proConfigs
  }
  remoteDirPath = sshConfigs.remoteDirPath
  remoteFilePath = remoteDirPath + '/dist.zip'
}

module.exports = { sshConfigs, remoteFilePath, remoteDirPath }