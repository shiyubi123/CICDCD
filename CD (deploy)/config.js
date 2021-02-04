let sshConfigs
const proConfigs = [
  {
    name: '',
    host: '',
    port: null,
    username: '',
    password: ''
  }
]
const sitConfigs = [
  {
    name: '',
    host: '',
    port: null,
    username: '',
    password: ''
  }
]
sshConfigs = proConfigs
let remoteDirPath = ''
if (process.env.env_config === 'sit') {
  sshConfigs = sitConfigs
  remoteDirPath = ''
}
const remoteFilePath = remoteDirPath + '/dist.zip'
module.exports = { sshConfigs, remoteFilePath, remoteDirPath }