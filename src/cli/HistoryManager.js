/**
 * @Author: Roman 306863030@qq.com
 * @Date: 2026-03-16 09:18:05
 * @LastEditors: Roman 306863030@qq.com
 * @LastEditTime: 2026-03-24 18:48:07
 * @FilePath: \deepfish\src\cli\HistoryManager.js
 * @Description: 对话历史记录、恢复
 * @
 */
const fs = require('fs-extra')
const path = require('path')
const dayjs = require('dayjs')
const { GlobalVariable } = require('../core/globalVariable')
const { v4: uuidv4 } = require('uuid')
const { logSuccess, logError } = require('../core/utils/log')
// cache => [history.json, id => [message.json, logs => [log.txt]]]
class HistoryManager {
  constructor(aiCli) {
    this.aiCli = aiCli
    this.configManager = GlobalVariable.configManager
    GlobalVariable.historyManager = this
    this.cacheDir = path.join(this.configManager.configDir, './cache')
    fs.ensureDirSync(this.cacheDir)
    this.historyFilePath = path.join(this.cacheDir, 'history.json')
    this.history = this.getHistory()
    this.id = null
    this.logDir = null
    this.initRecord()
  }

  initRecord() {
    this.autoClearRecord()
    const currentPath = process.cwd()
    const historyItem = this.history.find(
      (item) => item.execPath === currentPath,
    )
    if (!historyItem) {
      const id = uuidv4()
      const newHistoryItem = {
        id: id,
        execPath: currentPath,
        execTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
      // 根据id创建目录，再创建一个message.json文件
      const recordDir = path.join(this.cacheDir, id)
      const messageFile = path.join(recordDir, 'message.json')
      fs.ensureDirSync(recordDir)
      fs.writeJsonSync(messageFile, [], { spaces: 2 })
      this.history.push(newHistoryItem)
      this.updateHistory(this.history)
      this.id = newHistoryItem.id
    } else {
      historyItem.execTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      this.id = historyItem.id
    }
    const logDir = path.join(this.cacheDir, this.id, 'logs')
    fs.ensureDirSync(logDir)
    this.logDir = logDir
  }

  openDirectory() {
    // 打开目录
    const { spawn } = require('child_process')
    const platform = process.platform
    let command
    let args
    const dir = path.join(this.cacheDir, this.id)
    if (platform === 'darwin') {
      command = 'open'
      args = [dir]
    } else if (platform === 'win32') {
      command = 'explorer.exe'
      args = [dir]
    } else {
      command = 'xdg-open'
      args = [dir]
    }
    const child = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
    })
    child.on('error', (error) => {
      logError(`Error opening history directory: ${error.message}`)
    })
    child.unref()
  }

  autoClearRecord() {
    const retentionDays = 7
    const currentDate = dayjs()
    const history = this.history.filter(
      (item) => currentDate.diff(dayjs(item.execTime), 'day') > retentionDays,
    )
    if (history.length > 0) {
      history.forEach((item) => {
        const recordDir = path.join(this.cacheDir, item.id)
        fs.removeSync(recordDir)
      })
      this.history = this.history.filter(
        (item) =>
          currentDate.diff(dayjs(item.execTime), 'day') <= retentionDays,
      )
      this.updateHistory(this.history)
    }
  }

  updateMessage(message) {
    const messageFile = path.join(this.cacheDir, this.id, 'message.json')
    fs.writeJsonSync(messageFile, message, { spaces: 2 })
  }

  getMessage() {
    const messageFile = path.join(this.cacheDir, this.id, 'message.json')
    return fs.readJsonSync(messageFile, { throws: false }) || []
  }

  outputMessage() {
    const message = this.getMessage()
    const outputFile = path.join(process.cwd(), 'message.json')
    fs.writeJsonSync(outputFile, message, { spaces: 2 })
    logSuccess(`History messages have been output to ${outputFile}`)
  }

  getHistory() {
    const isExists = fs.existsSync(this.historyFilePath)
    if (isExists) {
      return fs.readJsonSync(this.historyFilePath, { throws: false })
    } else {
      // 创建一个文件
      fs.writeJsonSync(this.historyFilePath, {}, { spaces: 2 })
      return {}
    }
  }

  // 更新history文件
  updateHistory(history) {
    this.history = history
    fs.writeJsonSync(this.historyFilePath, this.history, { spaces: 2 })
  }

  record(messages) {
    try {
      this.updateMessage(messages)
      return true
    } catch (error) {
      console.error('Failed to record:', error.message)
      return false
    }
  }

  recover() {
    GlobalVariable.isRecovering = true
  }

  // 记录message以及压缩后的messages
  log(message) {
    const logFile = path.join(
      this.logDir,
      `log-${dayjs().format('YYYY-MM-DD HH')}}.txt`,
    )
    try {
      if (typeof message === 'object' && !Array.isArray(message)) {
        message = JSON.stringify(message)
      } else if (Array.isArray(message)) {
        message = '###压缩上下文###' + '\n' + JSON.stringify(message)
      }
      const logEntry = `[${new Date().toISOString()}] ${message}\n`
      fs.appendFileSync(logFile, logEntry)
      return true
    } catch (error) {
      console.error('Failed to log:', error.message)
      return false
    }
  }
}

module.exports = HistoryManager
