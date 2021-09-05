require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("./db");

const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
const accountsRouter = require("./routes/accountsRouter");
const userRouter = require("./routes/userRouter");

const app = express();

app.set("port", 4000);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/comment", commentRouter);
app.use("/accounts", accountsRouter);
app.use("/user", userRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const errorStatus = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(errorStatus).json({ message, data });
});

app.listen(app.get("port"), () => {
  console.log(`✅ Server listening on http://localhost:${app.get("port")}`);
});
