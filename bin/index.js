#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const chalk = require('chalk');
const symbols = require('log-symbols');

// 问题
const questions = [
  {
    type: 'input',
    name: 'description',
    message: 'please input project description:',
    default:'vue project'
  },
  {
    name: 'template',
    type: 'list',
    message: 'which template do you need:',
    choices: ['single-page','multi-page']
  }
]

// 项目版本号查询
program
.version(require('../package.json').version)

// 创建指令
program
.command('create <project_name>')
.action(project_name=>{
  let projectPath = `${process.cwd()}/${project_name}`
  if(!fs.existsSync(projectPath)){
    inquirer
    .prompt(questions)
    .then(answer=>{
      const spinner = ora(`downloading template...`);
      spinner.start();
      download(
        'direct:https://github.com/Xiaoha0226/vue-cli-spa.git',
        `${project_name}`,
        { clone: true },
        (err)=>{
          if(err){
            spinner.fail(`downloading template failed`);
            console.log(symbols.error, chalk.red(err));
          }else{
            spinner.succeed(`downloading template successed`);
            // 更新模板的package.json
            let fileName = `${project_name}/dev/package.json`;
            let data = fs.readFileSync(fileName)
            let config = {
              name:`${project_name}`,
              description:`${answer.description}`
            }
            let content = JSON.parse(data.toString())
            // json文件格式化
            let newContent = JSON.stringify(Object.assign(content,config),null,"\t")
            fs.writeFileSync(fileName,newContent)
          } 
        })
    })
  }else{
    console.log(symbols.error, chalk.red(`${project_name}项目已存在`));
  }
})

program.parse(process.argv);
