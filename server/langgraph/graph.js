import { StateGraph } from "@langchain/langgraph";
import { 
  validateCompanyNode, 
  fetchFinancialsNode, 
  fetchNewsNode, 
  llmAnalysisNode 
} from "./nodes.js";

// Define the shape of our state
const stateChannels = {
  query: {
    value: (x, y) => y ?? x,
    default: () => ""
  },
  ticker: {
    value: (x, y) => y ?? x,
    default: () => ""
  },
  companyName: {
    value: (x, y) => y ?? x,
    default: () => ""
  },
  quote: {
    value: (x, y) => y ?? x,
    default: () => null
  },
  news: {
    value: (x, y) => y ?? x,
    default: () => []
  },
  historicalReturns: {
    value: (x, y) => y ?? x,
    default: () => null
  },
  marketReturns: {
    value: (x, y) => y ?? x,
    default: () => null
  },
  analysisResult: {
    value: (x, y) => y ?? x,
    default: () => null
  },
  error: {
    value: (x, y) => y ?? x,
    default: () => null
  }
};

const graph = new StateGraph({ channels: stateChannels });

// Add nodes
graph.addNode("validateCompany", validateCompanyNode);
graph.addNode("fetchFinancials", fetchFinancialsNode);
graph.addNode("fetchNews", fetchNewsNode);
graph.addNode("llmAnalysis", llmAnalysisNode);

// Define edges (linear flow)
graph.addEdge("__start__", "validateCompany");
graph.addEdge("validateCompany", "fetchFinancials");
graph.addEdge("fetchFinancials", "fetchNews");
graph.addEdge("fetchNews", "llmAnalysis");
graph.addEdge("llmAnalysis", "__end__");

export const stockGraph = graph.compile();
