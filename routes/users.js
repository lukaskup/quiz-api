import { ObjectId } from "mongodb";
import { validateUser } from "../validation/functions.js";

export const createRoutes = (app, conn) => {
  app.route("/users").get(async function (_req, res) {
    const db = conn.getDb();

    db.collection("users")
      .find({})
      .limit(50)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching users!");
        } else {
          res.json(result);
        }
      });
  });

  app.route("/users/:id").get(async function (req, res) {
    const db = conn.getDb();

    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).send("Error fetching user!");
      return;
    }

    const userQuery = {
      _id: new ObjectId(req.params.id),
    };

    let user = await db.collection("users").find(userQuery).limit(1).toArray();
    user = user[0];
    if (user) {
      const userQuizes = (
        await db.collection("usersQuizes").find().toArray()
      ).filter((userQuiz) => user._id.equals(new ObjectId(userQuiz.user)));

      for (const userQuiz of userQuizes) {
        userQuiz.quiz = (
          await db
            .collection("quizes")
            .find({ _id: new ObjectId(userQuiz.quiz) })
            .toArray()
        )[0];
      }
      res.json({
        user: user,
        userQuizes: userQuizes,
      });
    } else {
      res.status(400).send("Error fetching user!");
    }
  });

  app.route("/users").post((req, res) => {
    const errors = validateUser(req.body);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    const db = conn.getDb();
    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };

    db.collection("users").insertOne(user, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting matches!");
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
  });

  app.route("/users").patch(function (req, res) {
    const errors = validateUser(req.body);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const db = conn.getDb();
    const userQuery = { _id: ObjectId(req.body._id) };
    const updates = {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
      },
    };

    db.collection("users").updateOne(
      userQuery,
      updates,
      function (err, _result) {
        if (err) {
          res.status(400).send(`Error updating user with id ${userQuery._id}!`);
        } else {
          console.log(_result);
          res
            .status(200)
            .send(`Success updating user with id ${userQuery._id}!`);
        }
      }
    );
  });

  app.route("/users/:id").delete((req, res) => {
    const dbConnect = conn.getDb();
    const userQuery = { _id: ObjectId(req.params.id) };

    dbConnect.collection("users").deleteOne(userQuery, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting user with id ${userQuery.id}!`);
      } else {
        res.status(200).send(`Success deleting user with id ${userQuery.id}!`);
      }
    });
  });
};
