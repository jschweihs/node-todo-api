const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

// Sample ObjectID
var id = '5aa11f74ff3938d225b83a2a';

Todo.find({
  _id: id // Can pass in string as id with mongoose
}).then((todos) => {
  console.log('Todos', todos); // Prints array
});

Todo.findOne({
  _id: id
}).then((todo) => {  // Returns single element instead of array
  console.log('Todos', todo); // Prints object
});

Todo.findById(id).then((todo) => { // Func takes string instead of obj
  if(!todo) { // Handling null return when Id is invalid
    return console.log('Id not found');
  }
  console.log('Todos', todo); // Prints object
}).catch((e) => {
  return console.log(e);
});
