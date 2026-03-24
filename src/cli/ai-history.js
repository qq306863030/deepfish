const { program } = require("commander");
const HistoryManager = require("./HistoryManager");
const historyManager = new HistoryManager();
const extCommand = program
  .command("history")
  .description("History management commands");

extCommand
  .command("clear")
  .description("Clear the history messages")
  .action(() => {
    historyManager.clearMessage();
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
