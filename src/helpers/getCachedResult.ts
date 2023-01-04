import type { PDFDocumentProxy } from "pdfjs-dist";
import type { DefinitionWord } from "../types.js";

import type { PrismaClient } from "@prisma/client";

const getCachedResult = async (
  docProxy: PDFDocumentProxy,
  prisma: PrismaClient
): Promise<DefinitionWord[] | null> => {
  // Potentially create a GO microservice
  const { metadata } = await docProxy.getMetadata();
  const title = metadata.get("dc:title");
  const creator = metadata.get("dc:creator");

  const response = await prisma.pdfs.findUnique({
    where: { creator_title: { creator, title } },
    select: { data: true },
  });

  const data = response?.data ?? null;

  return data;
};

export default getCachedResult;
