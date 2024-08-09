import express from "express";
import getEnv from "./envConfig";
import cors from "cors";
import bodyParser from "body-parser";
import invoiceRouter from "./routes/invoice";
import connectDb from "./model/client";

connectDb()
  .then(() => console.log("Connected to db!"))
  .catch(() => console.log("Failed to catch"));

const app = express();
const env = getEnv();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use("/invoice", invoiceRouter);

app.listen(env.PORT, () => console.log("Server on port: ", env.PORT));
