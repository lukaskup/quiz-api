import { MongoClient } from "mongodb";
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

export const connectToServer = (callback) => {
  client.connect(function (err, db) {
    if (err || !db) {
      return callback(err);
    }

    dbConnection = db.db("quiz");
    console.log("Successfully connected to MongoDB.");

    return callback("connected");
  });
};

export const getDb = () => {
  return dbConnection;
};
