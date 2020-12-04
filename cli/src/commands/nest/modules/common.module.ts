import { cap } from "@src/utils/string";

export const createModule = (moduleName: string) => {
  const capModuleName = cap(moduleName);
  const service = `${capModuleName}Service`;
  const controller = `${capModuleName}Controller`;
  return `
  import { Module } from '@nestjs/common';
  import ${service} from './${moduleName}.service';
  import ${controller} from './${moduleName}.controller';
  
  @Module({
    imports: [],
    controllers: [${controller}],
    providers: [${service}],
  })
  export default class ${cap(moduleName)}Module {}
  `;
};
