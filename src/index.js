import LangChainChat from "./modules/LangchainChat.js";
import LangChainModule from "./modules/LangchainModule.js";

const langchain = new LangChainModule();
//langchain.promptTemplate("cars");
// langchain.main("What would be a good shop name for a business that seels caps?");
// langchain.promptTemplateMultiChain('India');
//langchain.promptAgent()

const langchainChat = new LangChainChat()
langchainChat.customAssistantTemplate("Spanish", "How are you doing today?")