const defaultConfig = {
  ai: [],
  currentAi: "",
  maxIterations: -1, // ai完成工作流的最大迭代次数，-1表示无限制
  maxMessagesLength: 150000, // 最大压缩长度，-1表示无限制
  maxMessagesCount: 100, // 最大压缩数量，-1表示无限制
  extensions: [],
  skills:[],
  encoding: "", // 命令行编码格式
};

const aiCliConfig = {
  DeepSeek: {
    baseUrl: "https://api.deepseek.com",
    model: {
      list: ["deepseek-chat", "deepseek-reasoner", "other"],
      defaultValue: "",
    },
    type: 'deepseek',
    apiKey: "",
    temperature: 0.7,
    maxTokens: 8192,
    stream: true,
  },
  Ollama: {
    baseUrl: "http://localhost:11434/v1",
    model: {
      list: [],
      defaultValue: "deepseek-v3.2:cloud",
    },
    type: 'ollama',
    apiKey: "ollama",
    temperature: 0.7,
    maxTokens: 8192,
    stream: true,
  },
  OpenAI: {
    baseUrl: "https://api.openai.com/v1",
    model: {
      list: [],
      defaultValue: "gpt-4",
    },
    type: "openai",
    apiKey: "",
    temperature: 0.7,
    maxTokens: 8192,
    stream: true,
  },
};



module.exports = {
  aiCliConfig,
  defaultConfig,
};
