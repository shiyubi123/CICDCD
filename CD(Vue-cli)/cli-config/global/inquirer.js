const inquirer = require('inquirer')

global.ask = function (questions) {
  return inquirer.prompt(questions)
}