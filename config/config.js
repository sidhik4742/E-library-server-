const MongoClient = require('mongodb').MongoClient;
// const objectId = require("mongodb").ObjectID;
// const config = require("../config/config");

let state = {
  db: null,
};

module.exports = {
  dbConnect: (callback) => {
    try {
      const url =
        'mongodb+srv://sidhik:letmein64742@cluster0.wgcac.mongodb.net/eLibraryDB?retryWrites=true&w=majority';
        // || 'mongodb://localhost:27017';
      const dbName = 'eLibraryDB';
      MongoClient.connect(url, {useUnifiedTopology: true}, (error, db) => {
        if (error) {
          return callback(error);
        }
        console.log('Connected successfully to server');
        //   console.log(db);
        state.db = db.db(dbName);
        callback();
      });
    } catch (error) {
      console.log('Database connection error' + error);
    }
  },
};

module.exports.getConnection = () => {
  return state.db;
};
