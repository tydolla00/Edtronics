const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 8000;

app.get("/", (req: any, res: any) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
