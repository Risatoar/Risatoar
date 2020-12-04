import { cap } from "@src/utils/string";

export const createService = (moduleName: string) => {
  const capModuleName = cap(moduleName);
  const service = `${capModuleName}Service`;
  return `
  import { Injectable } from "@nestjs/common";

  @Injectable()
  export default class ${service} {}
  `;
};
