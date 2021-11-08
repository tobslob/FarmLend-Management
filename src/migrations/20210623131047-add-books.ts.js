const uuid = require("uuid/v4");

module.exports = {
  async up(db, client) {
    for (let i = 0; i < 50; i++) {
      await db.collection("books").insertOne({
        id: uuid(),
      })
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
