var mongoose = require('mongoose');

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// Create model for todo
var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

// Create instance of todo
var newTodo = new Todo({
  text: 'Cook dinner',
  completed: true,
  completedAt: 0
});

// Add todo to the database
newTodo.save().then((doc) => {
  console.log('Saved todo', doc)
}, (e) => {
  console.log("Unable to save todo")
});
