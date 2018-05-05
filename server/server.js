require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// TODOS

// Add new todo
app.post('/todos', authenticate, async (req, res) => {
  try {
    var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    });
    const doc = await todo.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get todos
app.get('/todos', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({_creator: req.user._id});
    res.send({todos});
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get single todo
app.get('/todos/:id', authenticate, async (req, res) => {

  try {
    var id = req.params.id;
    // Verify id is valid format
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    const todo = await Todo.findOne({_id: id, _creator: req.user._id});
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  } catch (e) {
    res.status(400).send();
  }
});

// Delete todo
app.delete('/todos/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  } catch (e) {
    res.status(400).send();
  }
});

// Update todo
app.patch('/todos/:id', authenticate, async (req,res) => {

  try {
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
    const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true});
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  } catch (e) {
    res.status(400).send();
  }
});

// USER

// Create new user
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get user with JWT
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// Logging in user
app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  };
});

// Logout user
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
