const express = require("express");

const cors = require("cors");
const app = express();
const axios = require("axios");
const fetch = require("node-fetch");
app.use(express.json());
app.use(cors());

const bcrypt = require("bcrypt");
const saltRounds = 10;
const API_KEY = process.env.APIKEY;
require("dotenv").config();

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const recipe = require("./controllers/recipe");
const remove = require("./controllers/remove");

const db = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

// app.get("/searchrecipe/:query", async (req, res) => {
//   try {
//     const response = await axios.get(
//       `https://api.edamam.com/api/recipes/v2?type=public&q=${req.params.query}&app_id=1f1fe157&app_key=adf65b2d88f6b6e7d91211344c5b19a4`
//     );
//     console.log(req.params);
//     res.status(200).json(response);
//   } catch (error) {
//     console.log(req.params);
//     res.status(400).send(error);
//   }
// });

app.get("/searchrecipe/:query", (req, res) => {
  console.log(process.env.APIKEY);
  fetch(
    `https://api.edamam.com/api/recipes/v2?type=public&q=${req.params.query}&app_id=1f1fe157&app_key=${process.env.APIKEY}`
  )
    .then(response => response.json())
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => res.status(400).send(err));
});

app.get("/findrecipe/:foodtype", (req, res) => {
  const { foodtype } = req.params;

  if (foodtype !== "Dessert") {
    fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${foodtype}&app_id=1f1fe157&app_key=${process.env.APIKEY}&imageSize=REGULAR&mealType=${foodtype}&Main%20course`
    )
      .then(response => response.json())
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => res.status(400).send(err));
  } else if (foodtype === "Dessert") {
    fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${foodtype}&app_id=1f1fe157&app_key=${process.env.APIKEY}&imageSize=REGULAR`
    )
      .then(response => response.json())
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => res.status(400).send(err));
  }
});

app.get("/findcuisine/:foodtype", (req, res) => {
  const { foodtype } = req.params;
  fetch(
    `https://api.edamam.com/api/recipes/v2?type=public&q=${foodtype}&app_id=1f1fe157&app_key=${process.env.APIKEY}&cuisineType=${foodtype}&imageSize=REGULAR&dishType=Main%20course`
  )
    .then(response => response.json())
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => res.status(400).send(err));
});

app.get("/", (req, res) => {
  res.status(200).send("Its working");
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
app.listen(process.env.PORT || 4000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
