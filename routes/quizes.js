import { ObjectId } from "mongodb";
import { validateQuiz } from "../validation/functions.js";

export const createRoutes = (app, conn) => {
  app.route("/quizes").get(async function (_req, res) {
    const db = conn.getDb();

    db.collection("quizes")
      .find()
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching quizes!");
        } else {
          res.json(result);
        }
      });
  });

  app.route("/quizes/:id").get(async function (req, res) {
    const db = conn.getDb();

    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).send("Error fetching quiz!");
      return;
    }

    const quizQuery = { _id: ObjectId(req.params.id) };

    let quiz = await db.collection("quizes").find(quizQuery).limit(1).toArray();
    quiz = quiz[0];
    if (quiz) {
      const userQuizes = (
        await db.collection("usersQuizes").find().toArray()
      ).filter((userQuiz) => quiz._id.equals(new ObjectId(userQuiz.quiz)));

      for (const userQuiz of userQuizes) {
        userQuiz.user = (
          await db

            .collection("users")
            .find({ _id: new ObjectId(userQuiz.user) })
            .toArray()
        )[0];
      }

      res.json({
        quiz: quiz,
        userQuizes: userQuizes,
      });
    } else {
      res.status(400).send("Error fetching user!");
    }
  });

  app.route("/quizes").post((req, res) => {
    const errors = validateQuiz(req.body);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    const db = conn.getDb();
    const quiz = {
      name: req.body.name,
      description: req.body.description,
      image_url: req.body.image_url,
    };

    db.collection("quizes").insertOne(quiz, function (err, result) {
      if (err) {
        return res.status(400).send("Error inserting matches!");
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        return res.status(204).send();
      }
    });
  });

  app.route("/quizes").patch(function (req, res) {
    const errors = validateQuiz(req.body);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const db = conn.getDb();
    const quizQuery = { _id: ObjectId(req.body._id) };
    const updates = {
      $set: {
        name: req.body.name,
        description: req.body.description,
        image_url: req.body.image_url,
      },
    };

    db.collection("quizes").updateOne(
      quizQuery,
      updates,
      function (err, _result) {
        if (err) {
          res.status(400).send(`Error updating quiz with id ${quizQuery.id}!`);
        } else {
          res
            .status(200)
            .send(`Success updating quiz with id ${quizQuery._id}!`);
        }
      }
    );
  });

  app.route("/quizes/:id").delete((req, res) => {
    const dbConnect = conn.getDb();
    const quizQuery = { _id: ObjectId(req.params.id) };

    dbConnect
      .collection("quizes")
      .deleteOne(quizQuery, function (err, _result) {
        if (err) {
          res.status(400).send(`Error deleting quiz with id ${quizQuery.id}!`);
        } else {
          dbConnect
            .collection("usersQuizes")
            .deleteMany({ quiz: req.params.id }, (err, _result) => {
              res
                .status(200)
                .send(`Success deleting quiz with id ${quizQuery.id}!`);
            });
        }
      });
  });
};
