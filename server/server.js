require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// Add new todo
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Get single todo
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // Verify id is valid format
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    // 404 if no todo is available
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  }).catch((e) => {
    res.status(400).send();
  });
});

// Delete todo
app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;
  // validate the id
  if (!ObjectID.isValid(id)) {
    // return 404
    return res.status(404).send();
  }

  // remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
      // 404 if no todo is returned
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
});

// Update todo
app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;

  // Get body contents, only params that a user can update
  var body = _.pick(req.body, ['text', 'completed']);

  // Check for valid ID
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // Setup value for completedAt
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

// USER

// Create new user
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
