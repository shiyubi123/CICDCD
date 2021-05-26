const sshConfigs = require('./../config/server/ssh.json')
const pathConfigs = require('./../config/server/publicPath.json')

const historyPackConfigs = require('../config/pack.json')
const historyServerConfigs = require('../config/server.json')

async function getProConfig() {
  let config = {}, project = USE_PRO
  if (PRO_TYPE === 'Vue') {
    config = await getVueProjectConfig(project)
  } else {
    config.serverConfig = await getPureWebsServerConfig(project)
  }
  return config
}

async function getPureWebsServerConfig() {
  return await inquirerForDeployConfig()
}

async function getVueProjectConfig(project) {
  let serverConfig
  const packConfig = await inquirerForPackConfig(project)
  if (USE_ENV !== 'dev') {
    serverConfig = await inquirerForServerConfig(project)
  }
  return {
    project,
    packConfig,
    serverConfig
  }
}

async function inquirerForServerConfig(project) {
  let serverConfig
  if (project in historyServerConfigs && (await AskIfUseHistoryServerConfig(project)).use) {
    serverConfig = historyServerConfigs[project]
  } else if ((await AskIfSetNewServerConfig()).set) {
    serverConfig = await inquirerForDeployConfig()
  }
  return serverConfig
}

async function AskIfUseHistoryServerConfig(project) {
  const sshConfig = historyServerConfigs[project].sshConfig
  const message = sshConfig.reduce((prev, next) => prev += ` ${next} (host: ${sshConfigs[next].host}) `
    , `是否使用ssh历史纪录部署 ? \n  sshConfig:`) + `\n  pathConfig: ${historyServerConfigs[project].pathConfig}\n`

  return await ask([{
    name: 'use',
    type: 'confirm',
    message: message
  }])
}

async function AskIfSetNewServerConfig() {
  return await ask([{
    name: 'set',
    type: 'confirm',
    message: '是否为项目进行部署配置 ?'
  }])
}

async function inquirerForDeployConfig() {
  let custom = false
  const sshConfig = await inquirerForSSHConfig()
  const pathConfig = await inquirerForPathConfig() // public path
  return config = { sshConfig, pathConfig, custom }

  async function inquirerForSSHConfig() {
    let sshConfig
    sshConfig = (await ask([{
      name: 'server',
      type: 'checkbox',
      message: '请选择想要部署的服务器',
      choices: [...sshChoices(), 'custom'],
      validate: (input) => {
        if (input.indexOf('custom') > 0 && input.length > 1) {
          return '选择自定义选项时不能带有其他选项'
        } else if (input.length < 1) {
          return '请至少选择一个选项'
        }
        return true
      }
    }])).server

    if (sshConfig[0] === 'custom') {
      custom = true
      sshConfig = await ask([
        createCustomQuestion('host'),
        createCustomQuestion('post'),
        createCustomQuestion('username'),
        createCustomQuestion('password'),
        createCustomQuestion('name'),
      ])
    }
    return sshConfig
  }

  async function inquirerForPathConfig() {
    let pathConfig = (await ask([
      {
        name: 'path',
        type: 'list',
        message: '请选择部署路径',
        choices: [...pathChoices(), 'custom']
      }
    ])).path
    if (pathConfig === 'custom') {
      pathConfig = {
        path: (await ask([
          createCustomQuestion('path')
        ])).path
      }
    }
    return pathConfig
  }

  function createCustomQuestion(name) {
    return {
      name: `${name}`,
      type: 'input',
      message: `请输入服务器的 ${name}:`
    }
  }
}

async function inquirerForPackConfig(project) {
  let useHistory
  if (hasHistory()) {
    useHistory = (await ask([
      {
        name: 'useHistory',
        type: 'confirm',
        message: `是否使用该项目的历史版本打包 (basePath: ${historyPackConfigs[project][USE_ENV].basePath}, decorator: ${historyPackConfigs[project][USE_ENV].decorator})`
      }
    ])).useHistory
  }

  let packConfig = await ask([
    {
      name: 'basePath',
      type: 'input',
      message: '请输入打包路径，为该项目的资源路径，可以是cdn路径',
      default: '',
      when: () => !useHistory
    },
    {
      name: 'decorator',
      type: 'checkbox',
      message: '请勾选修饰符',
      default: [],
      choices: [
        'noExtract',
        'rem'
      ],
      when: () => !useHistory
    }
  ])
  if (useHistory) {
    const historyPackConfig = historyPackConfigs[project][USE_ENV]
    historyPackConfig.useHistory = true
    return historyPackConfig
  }
  return packConfig

  function hasHistory() {
    return (project in historyPackConfigs && USE_ENV in historyPackConfigs[project])
  }
}

function sshChoices() {
  let choices = []
  for (key in sshConfigs) {
    const host = sshConfigs[key].host
    const name = sshConfigs[key].name
    choices.push({
      name: `${host} (${name})`,
      value: name
    })
  }
  return choices
}

function pathChoices() {
  return pathConfigs[PRO_TYPE]
}

module.exports = { getProConfig }