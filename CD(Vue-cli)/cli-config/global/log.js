const chalk = require('chalk')

function createLogMethods(key, color, type, display = 'title') {
  global[key] = function (text) {
    switch (display) {
      case 'title':
        console.log(chalk[color](`${type}: `) + text)
        break;
      case 'all':
        console.log(chalk[color](`${text}`))
        break;
      case 'pure':
        console.log((`${type}: ${text}`))
        break;
    }
  }
}

createLogMethods('logError', 'red', 'Error')
createLogMethods('logWarning', 'yellow', 'Warning')
createLogMethods('logSuccess', 'green', 'Success', 'all')