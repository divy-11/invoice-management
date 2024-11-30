const express = require("express");
const mainRouter = require("./routes/main");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", mainRouter);

app.listen(4040);

