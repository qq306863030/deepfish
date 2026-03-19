/**
 * @Author: Roman 306863030@qq.com
 * @Date: 2026-03-19 11:45:10
 * @LastEditors: Roman 306863030@qq.com
 * @LastEditTime: 2026-03-19 12:34:31
 * @FilePath: \deepfish\src\cli\ai-ext.js
 * @Description: ai ext 相关命令
 * @
 */
const { program } = require("commander");
const { addExtensionToConfig, removeExtensionFromConfig, viewExtensionsFromConfig } = require("./configTools");

const extCommand = program
  .command("ext")
  .description("Extension management commands");

extCommand
  .command("add <filename>")
  .description("Add extension tool to the configuration")
  .action((filename) => {
    addExtensionToConfig(filename);
  });

extCommand
  .command("del <filename>")
  .description("Remove extension tool from the configuration")
  .action((filename) => {
    removeExtensionFromConfig(filename);
  });

extCommand
  .command("ls")
  .description("List all extension tools in the configuration")
  .action(() => {
    viewExtensionsFromConfig();
  });