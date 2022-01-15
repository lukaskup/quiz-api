import "dotenv/config";
import express from "express";
import * as conn from "./conn.js";
import bodyParser from "body-parser";
import cors from "cors";
import * as userRoutes from "./routes/users.js";
import * as quizesRoutes from "./routes/quizes.js";
import * as usersQuizesRoutes from "./routes/usersQuizes.js";

export const app = express();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

conn.connectToServer((message) => {
  console.log(message);
});

userRoutes.createRoutes(app, conn);
quizesRoutes.createRoutes(app, conn);
usersQuizesRoutes.createRoutes(app, conn);

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
