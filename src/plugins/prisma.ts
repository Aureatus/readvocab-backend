import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (instance) => {
  const prisma = new PrismaClient();

  await prisma.$connect();

  instance.decorate("prisma", prisma);

  instance.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
  });
});

export default prismaPlugin;
