import { createServer, Model } from "json-server";
import { readFileSync } from "fs";

const server = createServer();
const data = JSON.parse(readFileSync("./data/cities.json", "utf-8"));
server.use(Model());
server.db = server.db;
server.use(jsonServer.rewriter({}));
server.use(jsonServer.defaults());
server.db = { cities: data };

server.listen(8000, () => {
  console.log("JSON Server is running");
});
