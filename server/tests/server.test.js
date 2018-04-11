// Requries
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// Local requires
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// Create dummy todo examples
const todos = [{
  _id: new ObjectID(),
  text: 'First test'
}, {
  _id: new ObjectID(),
  text: 'Second test'
}];

// Remove all existing items in db
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

// Adding new todo
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a new todo with invalid body', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2); // 2 from dummy examples
          done();
        }).catch((e) => done(e));
      });
  });
});

// Reading all todos
describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

// Reading single todo via ID
describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    // make request using real object id, call toHexString
    // it will be valid id but not found in test collection
    // expect 404
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    // ex /todos/123
    request(app)
      .get('/todos/1')
      .expect(404)
      .end(done);
  });
});
