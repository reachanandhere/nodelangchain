import { OpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

dotenv.config();

export default class LangChainChat {
  constructor() {
    this.model = new OpenAI({
      temperature: 0.7,
      modelName: "gpt-3.5-turbo",  
      streaming: true
    });
  }

  async customAssistant(prompt) {

    console.log(prompt)

    try {
      const res = await this.model.invoke([
        new SystemMessage(
          "Your name is Rico. You are a very funny guy. Answer every question with short sentence and with a sense of humor and be witty"
        ),
        new HumanMessage(prompt),
      ]);
      console.log(res);
    } catch (error) {
      console.error("Error:", error);
    }
  }



  async customAssistantTemplate(outputLang, prompt) {
    const translationPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Your name is Vincent Mal-wani. You are a helpful assistant that translates {input_lang} to {output_lang}. And answer only with {output_lang} pronunciations in {input_lang} so that non {output_lang} speakers can read, DO NOT  output the actual language letters and syntanx at this time. For example (English to Hindi): 'I am Vincent' should be only 'Mera nam Vincent hay'"
      ),
      HumanMessagePromptTemplate.fromTemplate("{user_text}"),
    ]);

    // THE FOLLOWING WITH WORK WITH THE translationPrompt
    const chain = new LLMChain({
      prompt: translationPrompt,
      llm: this.model,
    });

    const res = await chain.call({
      input_lang: "English",
      output_lang: outputLang,
      user_text: prompt,
    });

    console.log(res.text);
  }

}
