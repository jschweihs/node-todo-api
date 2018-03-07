const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Could not connect to database:', err);
  }
  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp');

  db.collection('Todos').find({
    _id: new ObjectID('5a9f89d66d99b0869f4d0a39')
  }).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  db.collection('Todos').find().count().then((count) => {
    console.log('Todos count:', count);
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  // client.close();
});
