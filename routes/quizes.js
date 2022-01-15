export const createRoutes = (app, conn) => {
  app.route("/quizes").get(async function (_req, res) {
    const db = conn.getDb();

    db.collection("quizes")
      .find({})
      .limit(50)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching quizes!");
        } else {
          res.json(result);
        }
      });
  });

  app.route("/quizes").post((req, res) => {
    const db = conn.getDb();
    const quiz = {
      name: req.body.name,
      description: req.body.description,
      image_url: req.body.image_url,
    };

    db.collection("quizes").insertOne(quiz, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting matches!");
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
  });

  app.route("/quizes").patch(function (req, res) {
    const db = conn.getDb();
    const quizQuery = { _id: req.body.id };
    const updates = {
      $inc: {
        name: req.body.name,
        description: req.body.description,
        image_url: req.body.image_url,
      },
    };

    db.collection("quiz").updateOne(
      quizQuery,
      updates,
      function (err, _result) {
        if (err) {
          res.status(400).send(`Error updating quiz with id ${quizQuery.id}!`);
        } else {
          console.log("1 document updated");
        }
      }
    );
  });

  app.route("/users/:id").delete((req, res) => {
    const dbConnect = conn.getDb();
    const quizQuery = { _id: req.body.id };

    dbConnect.collection("quiz").deleteOne(quizQuery, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting quiz with id ${quizQuery.id}!`);
      } else {
        console.log("1 document deleted");
      }
    });
  });
};
