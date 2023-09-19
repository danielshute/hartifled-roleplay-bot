const { MongoClient } = require('mongodb');

const url = process.env.MONGOOSE
const client = new MongoClient(url);

const dbName = 'hartfield-global';

client.connect();
console.log('Connected successfully to data server');
const db = client.db(dbName);
const usersCollection = db.collection('players');

async function addUserIfNotExist(discordId) {

    const existingUser = await usersCollection.findOne({ $or: [{ discordId }] });

    if (!existingUser) {
        let count = await usersCollection.countDocuments();
        count = count + 100

        const newUser = {
            discordId,
            'memberNo': count,
            'roles': ['member'],
            'characters': [],
            'punishments': [],
            'banned': false
        };

        const result = await usersCollection.insertOne(newUser);

        return result
    } else {
        return existingUser
    }
}

module.exports = {
    addUserIfNotExist
}
