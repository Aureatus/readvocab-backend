/* eslint-disable @typescript-eslint/return-await */

import WordPOS from "wordpos";

import type { CorpusWord } from "../types.js";

const findDefinitions = async (
  wordList: CorpusWord[]
): Promise<Array<string | null | undefined>> => {
  const wordSearch = new WordPOS();
  const definitions = await Promise.all(
    wordList.map(async (wordObject) => {
      const getWordInfo = async (): Promise<Array<{ def: string }>> => {
        switch (wordObject.PoS) {
          case "Verb":
            return await wordSearch.lookupVerb(wordObject.word);
          case "Adj":
            return await wordSearch.lookupAdjective(wordObject.word);
          case "Adv":
            return await wordSearch.lookupAdverb(wordObject.word);
          default:
            return await wordSearch.lookup(wordObject.word);
        }
      };

      const wordInfo = await getWordInfo();
      if (wordInfo.length === 0) return null;

      return wordInfo[0]?.def.trim();
    })
  );
  return definitions;
};

export default findDefinitions;
