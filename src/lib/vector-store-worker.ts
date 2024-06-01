import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { XenovaTransformersEmbeddings } from "../lib/embed";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

self.onmessage = async (e: MessageEvent) => {
  const { fileText, fileType, userInput } = e.data;

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 50,
  });

  const docs = await textSplitter.splitDocuments(fileText);
  let results;
  try {
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new XenovaTransformersEmbeddings()
    );
    results = await vectorStore.similaritySearch(userInput, 5);
    postMessage(results);
  } catch (err) {
    console.error("Vector search worker error:", err);
    postMessage(null);
  }
};
