const fs = require('fs')
const path = require('path')
const ora = require('ora')

global.fs = fs
global.path = path
global.ora = ora

global.saveJson = async function (saveOption, path, callback = () => { }) {
  const jsonString = JSON.stringify(saveOption)
  try {
    await fs.writeFile(path, jsonString, callback)
  } catch (e) {
    logError(e)
  }
}

global.copy = function (item) {
  let copyItem
  let type = Object.prototype.toString.call(item)
  switch (type) {
    case "[object Array]":
      copyItem = []
      break;
    case "[object Object]":
      copyItem = {}
      break;
  }
  for (const key in item) {
    if (typeof item[key] !== 'object') {
      copyItem[key] = item[key]
    } else {
      copyItem[key] = copy(item[key])
    }
  }
  return copyItem
}