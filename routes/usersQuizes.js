import { ObjectId } from "mongodb";
import { validateUserQuiz } from "../validation/functions.js";

export const createRoutes = (app, conn) => {
  app.route("/usersQuizes").get(async function (_req, res) {
    const db = conn.getDb();

    const userQuizes = await db.collection("usersQuizes").find({}).toArray();
    for (let userQuiz of userQuizes) {
      const userQuery = { _id: new ObjectId(userQuiz["user"]) };
      userQuiz["user"] = (
        await db.collection("users").find(userQuery).limit(1).toArray()
      )[0];

      const quizQuery = { _id: new ObjectId(userQuiz["quiz"]) };
      userQuiz["quiz"] = (
        await db.collection("quizes").find(quizQuery).limit(1).toArray()
      )[0];
    }
    res.json({ userQuizes: userQuizes });
  });

  app.route("/usersQuizes/:id").get(async function (req, res) {
    const db = conn.getDb();

    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).send("Error fetching user!");
      return;
    }

    const userQuizQuery = { _id: new ObjectId(req.params.id) };

    let userQuiz = await db
      .collection("usersQuizes")
      .find(userQuizQuery)
      .limit(1)
      .toArray();

    userQuiz = userQuiz[0];

    const userQuery = { _id: new ObjectId(userQuiz["user"]) };
    userQuiz["user"] = (
      await db.collection("users").find(userQuery).limit(1).toArray()
    )[0];

    const quizQuery = { _id: new ObjectId(userQuiz["quiz"]) };
    userQuiz["quiz"] = (
      await db.collection("quizes").find(quizQuery).limit(1).toArray()
    )[0];

    if (userQuiz) {
      res.json({
        userQuiz: userQuiz,
      });
    } else {
      res.status(400).send("Error fetching user!");
    }
  });

  app.route("/usersQuizes").post((req, res) => {
    const errors = validateUserQuiz(req.body);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
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

  app.route("/usersQuizes").patch(async function (req, res) {
    const errors = validateUserQuiz(req.body);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    const db = conn.getDb();

    const usersQuizesQuery = { _id: ObjectId(req.body._id) };
    const updates = {
      $set: {
        submitted_at: req.body.submitted_at,
        rating: req.body.rating,
        score: req.body.score,
        user: req.body.user,
        quiz: req.body.quiz,
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
          res
            .status(200)
            .send(`Success updating user with id ${usersQuizesQuery._id}!`);
        }
      }
    );
  });

  app.route("/usersQuizes/:id").delete((req, res) => {
    const dbConnect = conn.getDb();
    const usersQuizesQuery = { _id: ObjectId(req.params.id) };

    dbConnect
      .collection("usersQuizes")
      .deleteOne(usersQuizesQuery, function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(`Error deleting listing with id ${usersQuizesQuery.id}!`);
        } else {
          res.status(200).send("Succes delete");
        }
      });
  });
};
