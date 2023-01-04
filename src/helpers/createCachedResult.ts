/* eslint-disable no-unreachable */
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { DefinitionWord } from "../types.js";

import type { PrismaClient } from "@prisma/client";

const createCachedResult = async (
  docProxy: PDFDocumentProxy,
  prisma: PrismaClient,
  rareWordObjects: DefinitionWord[]
): Promise<void> => {
  try {
    const { metadata } = await docProxy.getMetadata();
    const title = metadata.get("dc:title");
    const creator = metadata.get("dc:creator");

    const document = {
      creator,
      title,
      data: rareWordObjects,
    };
    await prisma.pdfs.upsert({
      where: { creator_title: { creator, title } },
      create: document,
      update: document,
    });
  } catch (err) {
    console.error(err);
  }
};

export default createCachedResult;
