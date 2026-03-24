const { functions } = require("./SystemExtension");
const path = require("path");
const currentDir = process.cwd();
const screenshotPath = path.join(currentDir, "path.png");

functions.executeCommand("agent-browser open http://www.romangis.top && agent-browser wait --load networkidle && agent-browser screenshot --full screenshot.png")