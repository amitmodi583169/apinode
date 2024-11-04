console.log("running");
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'sigma';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('courses');
  
    // the following code examples can be pasted here...
    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);
    return 'done.';
  }

  main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

