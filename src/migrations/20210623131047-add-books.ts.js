const faker = require("faker");
const uuid = require("uuid/v4");

module.exports = {
  async up(db, client) {
    for (let i = 0; i < 50; i++) {
      await db.collection("books").insertOne({
        id: uuid(),
        title: faker.random.arrayElement([faker.commerce.productName(), faker.commerce.productName()]),
        author: `${faker.name.findName()} ${faker.name.lastName()}`,
        year: faker.random.arrayElement(["2016", "2017", "2018", "2019", "2020", "2021"]),
        genre: faker.random.word(),
        tags: [faker.random.word(), faker.random.word(), faker.random.word()],
        publisher: faker.company.companyName(),
        released_date: faker.date.past(),
        slug: faker.random.words(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        available_copies: faker.datatype.number(),
        total_sold: 0,
        likes: 0,
        rating: 0,
        available_copies: 50,
        images: [faker.image.imageUrl(), faker.image.imageUrl()],
        created_at: new Date(),
        updated_at: new Date()
      })
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
