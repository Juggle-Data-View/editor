/* eslint-disable @typescript-eslint/no-var-requires */

const exec = require('child_process').exec;
const inquirer = require('inquirer');

const prompts = [
  {
    type: 'list',
    message: '请选择发布环境：',
    name: 'env',
    choices: [
      {
        name: '测试环境',
        value: 'development',
      },
      {
        name: '预发环境',
        value: 'prerelease',
      },
      {
        name: '正式环境',
        value: 'production',
      },
    ],
    default: 'prerelease',
  },
];

inquirer.prompt(prompts).then((answers) => {
  const child = exec(`env-cmd -e ${answers.env} -r ./scripts/.env-cmdrc.js react-scripts build --colors`);

  child.stdout.on('data', (data) => {
    console.log(data);
  });

  child.stderr.on('data', function (data) {
    console.log('Error: ' + data);
  });
});
