const express = require("express");
const app = express();
const path = require("node:path");
const userRouter = require("./routes/userRouter");

const PORT = process.env.PORT || 3000;

const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`App is live at - http://localhost:${PORT}/`);
});
