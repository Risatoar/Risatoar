import { cap } from "@src/utils/string";

export const createController = (moduleName: string) => {
  const capModuleName = cap(moduleName);
  const service = `${capModuleName}Service`;
  return `
  import { Controller } from '@nestjs/common';
  import ${service} from './${moduleName}.service';
  
  @Controller('/')
  export default class ${capModuleName}Controller {
    constructor(private readonly ${moduleName}Service: ${service}) {}
  }
  `;
};
