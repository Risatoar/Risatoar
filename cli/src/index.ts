import commander from "commander";
import pkg from "../package.json";

import nest from "@command/nest";

commander.version(pkg.version).usage("<command> [options]");

commander
  .command("nest")
  .description("nestjs 常用初始化操作")
  .option("--init, [init]", '项目初始化', false)
  .option("--create, [create]", "局部文件创建", "")
  .action(cmd => nest(cmd));

commander.parse(process.argv);

if (commander.args.length === 0) {
  commander.help();
}
