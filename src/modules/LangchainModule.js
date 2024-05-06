import dotenv from "dotenv";
import { OpenAI } from "@langchain/openai";
import { LLMChain, SimpleSequentialChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { Calculator } from "langchain/tools/calculator";
import { SearchApi } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { HumanMessage, SystemMessage } from "langchain/schema";
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
      prompt: promptTemplate,
    });

    try {
      const response = await chain.call({
        product: promt,
      });

      console.log(response.text);
    } catch (err) {
      console.error("Error", err);
    }
  }

  async promptTemplateMultiChain(userCountry) {
    const firstTemplate =
      "What is the most popular city in {country} for tourists. Just return the name of the city";
    const firstPrompt = new PromptTemplate({
      inputVariables: ["country"],
      template: firstTemplate,
    });

    const chain1 = new LLMChain({
      llm: this.model,
      prompt: firstPrompt,
    });

    const secondTemplate =
      "What are the top thre things to do in this {city} for tourists. Just return the answer as three bullet points. And display the {city} in all uppercase above your list.";

    const secondPrompt = new PromptTemplate({
      inputVariables: ["city"],
      template: secondTemplate,
    });

    const chain2 = new LLMChain({
      llm: this.model,
      prompt: secondPrompt,
    });

    //combine both chains

    const overallChain = new SimpleSequentialChain({
      chains: [chain1, chain2],
      verbose: false,
    });
    //Running both chains with a country as input
    try {
      const finalAnswer = await overallChain.run(userCountry);
      console.log(finalAnswer);
    } catch (err) {
      console.log(err);
    }
  }

  async promptAgent() {
    const tools = [
      new Calculator(),
      new SearchApi("w55FCHaCZVpxyMU9Hmt5YxE1", {
        engine: "google_news",
      }),
    ];
    try {
      const executor = await initializeAgentExecutorWithOptions(
        tools,
        this.model,
        {
          agentType: "structured-chat-zero-shot-react-description",
          verbose: false,
        }
      );

      const res = await executor.call({
        input: "Find me the champion country in the World Cup cricket 2023?",
      });

      console.log(res.output);
    } catch (err) {
      console.error(err);
    }
  }

  async customAssistant(prompt) {

    

    try {
      const res = await this.model.call([
        new SystemMessage(
          "Your name is Rico. You are a very funny guy. Answer every question with short sentence and with a sense of humor "
        ),
        new HumanMessage(prompt),
      ]);
      // console.log(res.content);
    } catch (error) {
      console.error("Error:", error);
    }
  }


}
