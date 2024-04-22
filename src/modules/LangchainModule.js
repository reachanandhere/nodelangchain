import dotenv from "dotenv";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

dotenv.config();

export default class LangChainModule {
  constructor() {
    this.model = new OpenAI({
      temperature: 0.5,
      modelName: "gpt-3.5-turbo",
    });
  }

  async main(prompt) {
    try {
      const response = await this.model.call(prompt);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  async promptTemplate(prompt) {
    const firstTemplate = "What would be a good shop name for a business that seels {product}?";

    const promptTemplate = new PromptTemplate({
        template: firstTemplate,
        inputVariables: ["product"],    
    })

    const formattedPrompt = await promptTemplate.format({
        product: prompt
    })
    console.log(formattedPrompt)
    try {
      const response = await this.model.call(formattedPrompt);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

}
