const express = require("express");
const apiRoute = require("./api/apiRouter.js");
const server = express();
server.use(express.json());

server.use("/api/posts", apiRoute);

server.use("/", (req, res) => {
  res.status(200).send("The server is working!");
});

server.listen(8000, () => console.log("*** API ON PORT: 8000 ***"));