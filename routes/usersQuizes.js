export const createRoutes = (app, conn) => {
  app.route("/usersQuizes").get(async function (_req, res) {
    const db = conn.getDb();

    db.collection("usersQuizes")
      .find({})
      .limit(50)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching usersQuizes!");
        } else {
          res.json(result);
        }
      });
  });

  app.route("/usersQuizes").post((req, res) => {
    const db = conn.getDb();
    const user = {
      submitted_at: req.body.submitted_at,
      rating: req.body.rating,
      score: req.body.score,
      user: req.body.user,
      quiz: req.body.quiz,
    };

    db.collection("usersQuizes").insertOne(user, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting matches!");
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
  });

  app.route("/usersQuizes").patch(function (req, res) {
    const db = conn.getDb();
    const usersQuizesQuery = { _id: req.body.id };
    const updates = {
      $inc: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
      },
    };

    db.collection("usersQuizes").updateOne(
      usersQuizesQuery,
      updates,
      function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(
              `Error updating likes on listing with id ${usersQuizesQuery.id}!`
            );
        } else {
          console.log("1 document updated");
        }
      }
    );
  });

  app.route("/users/:id").delete((req, res) => {
    const dbConnect = conn.getDb();
    const usersQuizesQuery = { id: req.body.id };

    dbConnect
      .collection("usersQuizes")
      .deleteOne(usersQuizesQuery, function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(`Error deleting listing with id ${usersQuizesQuery.id}!`);
        } else {
          console.log("1 document deleted");
        }
      });
  });
};
