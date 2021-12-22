const handleRecipe = (req, res, db) => {
  const { name, image, userEmail, id, calories, ingredients } = req.body;

  db("usersavedrecipe")
    .insert({
      email: userEmail,
      recipename: name,
      recipeid: id,
      recipeimageurl: image,
      calories: calories,
      ingredients: ingredients
    })
    .then(data => {
      return db
        .select("*")
        .from("usersavedrecipe")
        .where("email", "=", userEmail)
        .then(user => {
          res.send(user);
        })
        .catch(err => res.status(400).res.json("unable to save recipe"));
    })
    .catch(err => console.log(err));
};

module.exports = {
  handleRecipe: handleRecipe
};
