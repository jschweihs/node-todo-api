const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Could not connect to database:', err);
  }
  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Wash dirty laundry',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo:', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // Insert new doc into Users collection  name, age, location

  // db.collection('Users').insertOne({
  //   name: 'Jake',
  //   age: 30,
  //   location: 'Chicago, IL'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert user:', err);
  //   }
  //
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  client.close();
});
