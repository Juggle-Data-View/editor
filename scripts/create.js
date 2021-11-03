/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * 创建 业务组件 脚本.
 * 功能包含：
 * 1. 根据`comps/_template_`目录创建业务组件目录
 * 2. 更新`mock-api/menu/menu.json`文件，插入1条组件数据（需重启mock）
 */

const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const inquirer = require('inquirer');
const ora = require('ora');
const exec = require('child_process').execSync;

const rootPath = path.join(__dirname, '../');

dayjs.locale('zh-cn');

const getTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
};

const getGitName = () => {
  const name = exec('git config --get user.name');
  return name.toString().trim();
};

const prompts = [
  {
    type: 'input',
    name: 'compName',
    message: '请输入组件名称（如：commonTitle）',
    validate: function (input) {
      if (!input) {
        return '不能为空';
      }
      return true;
    },
  },
  {
    type: 'input',
    name: 'compAlias',
    message: '请输入组件中文名称（如：通用标题）',
    validate: function (input) {
      if (!input) {
        return '不能为空';
      }
      return true;
    },
  },
  {
    type: 'input',
    name: 'compTempName',
    message: '请输入组件模板名称（默认值：index）',
    default: 'index',
  },
];

const compsDir = path.join(rootPath, 'src/components/comps');

const relativePath = (p) => p.replace(path.resolve(rootPath), '@');

const sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

const readdir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, function (err, files) {
      if (err) reject(err);
      resolve(files);
    });
  });
};

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, function (err, buffer) {
      if (err) reject(err);
      resolve(buffer.toString());
    });
  });
};

const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const mkdir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, function (err) {
      if (err) reject(err);
      resolve();
    });
  });
};

// 递归 copy 目录
const copyDir = (src, dist, answers) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (fs.existsSync(dist)) throw new Error(`已存在${dist}目录！`);
      await mkdir(dist);
      const fileNames = await readdir(src);
      for (let fileName of fileNames) {
        const sourceFilePath = path.join(src, fileName);
        const targetFilePath = path.join(dist, fileName);
        let stat = fs.lstatSync(sourceFilePath);
        if (!stat.isDirectory()) {
          let content = await readFile(sourceFilePath);
          let str = content
            .replace(/TEMPLATE_CREATED_TIME/, getTime())
            .replace(/TEMPLATE_AUTHOR/, getGitName())
            .replace(/TEMPLATE_ALIAS/, answers.compAlias);
          await writeFile(targetFilePath, str);
        } else {
          copyDir(sourceFilePath, targetFilePath, answers);
        }
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const updateMenuConfig = async (menuConfigPath, answers) => {
  try {
    const content = await readFile(menuConfigPath);
    const objMenu = JSON.parse(content);
    const compId = [answers.compName, answers.compTempName].join('/');
    objMenu.ids.push(compId);
    objMenu.entities[compId] = {
      alias: answers.compAlias,
      thumbnail: '',
    };
    await writeFile(menuConfigPath, JSON.stringify(objMenu, null, 2));
  } catch (error) {
    console.error('更新组件菜单配置失败！');
  }
};

const createTemplate = async () => {
  const spinner = ora('开始创建..');
  try {
    const answers = await inquirer.prompt(prompts);
    const { compName, compTempName } = answers;

    const sourceDir = path.join(compsDir, './_template_');
    const targetDir = path.join(compsDir, compName);

    if (fs.existsSync(targetDir)) {
      throw new Error(`已存在${compName}目录！`);
    }

    spinner.start();

    await sleep(200);

    // 拷贝组件目录
    await copyDir(sourceDir, targetDir, answers);
    spinner.succeed(`创建 ${relativePath(targetDir)} 目录成功！`);

    await sleep(200);

    if (compTempName !== 'index') {
      const fileName = 'config.tsx';
      const oldPath = path.join(targetDir, fileName);
      const newPath = oldPath.replace(/([^\s.]*)(.\S*$)/, `$1_${compTempName}$2`);
      fs.renameSync(oldPath, newPath);
      console.log(`config.tsx rename to config_${compTempName}.tsx`);
    }

    const menuConfigPath = path.join(rootPath, 'src/config/menu_dev.json');
    await updateMenuConfig(menuConfigPath, answers);
    spinner.succeed(`更新 ${relativePath(menuConfigPath)} 组件菜单配置成功！`);
  } catch (error) {
    console.log(error);
    spinner.fail(error.message);
  } finally {
    spinner.stop();
  }
};

createTemplate();
