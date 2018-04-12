const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Clear all Todos
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Clear one Todo
// Todo.findOneAndRemove

// Clear one Todo via ID
Todo.findByIdAndRemove('5aceb10063caea0225379994').then((todo) => {
  console.log(todo);
});
