require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Animal = require("./animal.controller");
const { Auth, isAuthenticated } = require("./auth.controller").default;
const port = 3000;

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
);


app.use(express.json());

app.get("/animals", isAuthenticated, Animal.list);
app.post("/animals", isAuthenticated, Animal.create);
app.put("/animals/:id", isAuthenticated, Animal.update);
app.patch("/animals/:id", isAuthenticated, Animal.update);
app.delete("/animals/:id", isAuthenticated, Animal.destroy);

app.post("/login", Auth.login);
app.post("/register", Auth.register);

app.use(express.static("app"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get("*", (req, res) => {
  res.status(404).send("Esta página no existe :(");
});

app.listen(port, () => {
  console.log("Arrancando la aplicación!");
});
