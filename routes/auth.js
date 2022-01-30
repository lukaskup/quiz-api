import { ObjectId } from "mongodb";
import md5 from "md5";

export const createRoutes = (app, conn) => {
  app.route("/register").post((req, res) => {
    const db = conn.getDb();

    const user = {
      login: req.body.login,
      password: md5(req.body.password),
    };

    db.collection("usersAuth").insertOne(user, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting matches!");
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
  });

  app.route("/login").post(async function (req, res) {
    const db = conn.getDb();
    const bodyPassword = md5(req.body.password);
    const login = req.body.login;
    let user = await db
      .collection("users")
      .find({ login: login })
      .limit(1)
      .toArray();

    console.log(user);
  });
};
