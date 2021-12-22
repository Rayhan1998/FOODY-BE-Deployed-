const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("incorrect from submition");
  }

  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({ name: name, email: loginEmail[0] })
          .then(user => {
            res.status(200).json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister
};
