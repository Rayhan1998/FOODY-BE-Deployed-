const express = require("express");

const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const bcrypt = require("bcrypt");
const saltRounds = 10;

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const recipe = require("./controllers/recipe");
const remove = require("./controllers/remove");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,

    database: "foody"
  }
});

app.get("/savedrecipe/:email", (req, res) => {
  db.select("*")
    .from("usersavedrecipe")
    .where("email", "=", req.params.email)
    .then(data => {
      res.send(data);
    });
});
app.post("/signin", (req, res) => {
  signin.signin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt, saltRounds);
});

app.post("/recipe", (req, res) => {
  recipe.handleRecipe(req, res, db);
});

app.delete("/delete/:id", (req, res) => {
  remove.handlerDelete(req, res, db);
});
app.listen(4001, () => {
  console.log(`app is running on port 4000`);
});
