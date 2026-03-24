const { program } = require("commander");
const historyManager = require("./HistoryManager");
const extCommand = program
  .command("history")
  .description("History management commands");

extCommand
  .command("recover")
  .description("Recover the history messages")
  .action(() => {
    historyManager.recover();
  });

extCommand
  .command("output")
  .description("Output the history messages to current directory")
  .action(() => {
    historyManager.outputMessage();
  });

extCommand
  .command("dir")
  .description("Open the history directory")
  .action(() => {
    historyManager.openDirectory();
  });
