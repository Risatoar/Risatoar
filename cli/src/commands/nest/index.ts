import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from 'chalk';
import shell from 'shelljs';
import { createController } from "./modules/common.controller";
import { createService } from "./modules/common.service";
import { createModule } from "./modules/common.module";

type NestActionType = "modules";

type NestOption = {
  init: boolean;
  create: NestActionType;
};

const __file = path.resolve(process.cwd());
const NEST_TEMPLATE_URL = "https://github.com/Risatoar/nest-template.git";

const CREATE_MODULE_ACTION_MAP = [
  { func: createService, name: "service" },
  { func: createController, name: "controller" },
  { func: createModule, name: "module" }
];

const createModules = () => {
  inquirer
    .prompt({
      name: "moduleName",
      message: "请输入module名",
      type: "input"
    })
    .then(answers => {
      const { moduleName } = answers;
      const rootPath = path.resolve(__file, moduleName);
      if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath);
      }
      CREATE_MODULE_ACTION_MAP.forEach(({ func, name }) => {
        console.log('creating :>> ', chalk.green(`正在创建${name}: ----> ${rootPath}/${moduleName}.${name}.ts`));
        fs.writeFileSync(
          path.resolve(rootPath, `${moduleName}.${name}.ts`),
          func(moduleName),
          "utf-8"
        );
      });
      console.log(chalk.greenBright(`create module:${moduleName} end`));
    });
};

const nestCommand = {
  modules: createModules
};

const initNestProject = () => {
  shell.exec(`git clone -b master ${NEST_TEMPLATE_URL}`);
};

const nest = (option: NestOption) => {
  const { init, create } = option;

  if (init) {
    initNestProject();
  } else if (!!create) {
    const func = nestCommand[create];
    func && func();
  }
};

export default nest;