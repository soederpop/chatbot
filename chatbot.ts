import { OpenAIChat } from "langchain/llms";
import { writeFile } from "fs/promises";

type PrefixMessage = {
  role: "user" | "assistant";
  content: string;
}

type ChatBotOptions = {
  messages: PrefixMessage[];
  historyPath: string;
  modelName?: string;
};

export class ChatBot {
  static create(options: ChatBotOptions) {
    return new ChatBot(options)
  }
  
  model: OpenAIChat;
  
  historyPath: string;
  
  history: PrefixMessage[] = [];

  constructor(options: ChatBotOptions) {
    this.historyPath = options.historyPath; 
    
    if (!this.historyPath.endsWith('.json')) {
      this.historyPath = this.historyPath + '.json'
    }

    this.model = this.createModel({
      messages: options.messages,
      modelName: options.modelName || "gpt-3.5-turbo"
    })
  }

  createModel(options: { messages: PrefixMessage[], modelName: string }) {
    return new OpenAIChat({
      modelName: options.modelName || "gpt-3.5-turbo",
      prefixMessages: options.messages,
    });
  }
  
  async send(text: string) {
    this.history.push({ role: "user", content: text })

    const response = await this.model.call(text)
    
    this.history.push({ role: "assistant", content: response })
   
    await writeFile(this.historyPath, JSON.stringify(this.history, null, 2))

    return response
  }
}