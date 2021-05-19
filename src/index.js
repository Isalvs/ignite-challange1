const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui

  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) return response.status(400).json({ error: "Usuário não encontrado! "});

  request.user = user

  return next();
}

//Feito
app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  );

  if(userAlreadyExists) {
    return response.status(400).json({
      error: "Já existe uma conta com este username!"
    });
  }

  const userCreation = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(userCreation);

  return response.status(201).json(userCreation);
});

//Feito
app.get('/users', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user)
});

//Feito
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

//Feito
app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;
  const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;


  const todo = user.todos.findIndex((todo) => todo.id === id);

  if (todo < 0) return response.status(404).json({error: "Usuário não possui esta atividade"})

  user.todos[todo].title = title
  user.todos[todo].deadline = deadline

  return response.json(user.todos[todo]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.findIndex((todo) => todo.id === id);

  if (todo < 0) return response.status(404).json({error: "Usuário não possui esta atividade"});

  user.todos[todo].done = true
  return response.json(user.todos[todo]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.findIndex((todo) => todo.id === id);
  if (todo < 0) return response.status(404).json({ error: "O usuário não possui esta tarefa" });

  user.todos.splice(todo, 1);  
  return response.sendStatus(204);

});

module.exports = app;