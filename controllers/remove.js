const handlerDelete = (req, res, db) => {
  const { id } = req.params;
  console.log(id.toString());
  db("usersavedrecipe")
    .where("recipeid", id)
    .del()
    .then(data => {
      return db
        .select("*")
        .from("usersavedrecipe")
        .where("email", req.body.email)
        .then(user => {
          res.status(200).send(user);
        })
        .catch(err => res.status(400).res.json("unable to delete Recipe"));
    });
};

module.exports = {
  handlerDelete: handlerDelete
};
