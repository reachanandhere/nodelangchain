import dotenv from "dotenv";
import { OpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

dotenv.config();

export default class LangChainModule {
  constructor() {
    this.model = new OpenAI({
      temperature: 0.7,
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
    const firstTemplate =
      "What would be a good shop name for a business that seels {product}? Give me a few options.";

    const promptTemplate = new PromptTemplate({
      template: firstTemplate,
      inputVariables: ["product"],
    });

    const formattedPrompt = await promptTemplate.format({
      product: prompt,
    });
    console.log(formattedPrompt);
    try {
      const response = await this.model.call(formattedPrompt);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }

  async promptTemplateChain(promt) {
    const firstTemplate =
      "What would be a good shop name for a business that seels {product}? Give me a few options.";
    const promptTemplate = new PromptTemplate({
      template: firstTemplate,
      inputVariables: ["product"],
    });

    const chain = new LLMChain({
      llm: this.model,
      prompt: promptTemplate
    })

    try {
      const response = await chain.call({
        product: promt
      })

      console.log(response.text)
    } catch(err) {
      console.error("Error", err)
    }


  }
}
