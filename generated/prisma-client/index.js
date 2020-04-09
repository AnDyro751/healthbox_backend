"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Product",
    embedded: false
  },
  {
    name: "KIND_VALUE",
    embedded: false
  },
  {
    name: "Customer",
    embedded: false
  },
  {
    name: "LineItem",
    embedded: false
  },
  {
    name: "Checkout",
    embedded: false
  },
  {
    name: "STATUS",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://67.205.136.164:4466`
});
exports.prisma = new exports.Prisma();
