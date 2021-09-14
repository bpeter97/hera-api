const mongodb = require('mongodb');

// Posts Collection
exports.taskCollection = async function loadTasksCollection() {
    const client = await mongodb.MongoClient.connect(
        process.env.DB_URI, 
        {useNewUrlParser: true}
    );

    return client.db(process.env.DB_NAME).collection('tasks');
}