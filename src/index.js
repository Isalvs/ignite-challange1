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
  // Complete aqui

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
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;


  const todoData = user.todos.map( todo => todo.id);
  const todoId = todoData.find(todo => id)
  if (todoId) {
    user.todos.forEach(data => {
      if( data.id === id) {
        data.title = title
        data.deadline = deadline

        return response.json(data);
      }
    });
  } else {
    return response.status(404).json({error: "Usuário não possui esta atividade"});
  } 
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
  const { id } = request.params;
  const { user } = request;

  const todoData = user.todos.map( todo => todo.id);
  const todoId = todoData.find(todo => id)
  if (todoId != id) {
    return response.status(404).json({error: "Usuário não possui esta atividade"});
  } else {
    user.todos.forEach(data => {
      if( data.id === id) {
        data.done = true
        return response.json(data);
      }
    });
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoData = user.todos.map( todo => todo.id);
  const todoId = todoData.find(todo => id)

  if (todoId !== id) {
    return response
    .status(404)
    .json({error: "Usuário não possui esta atividade"});
} else {
    user.todos.forEach(data => {
      if( data.id === id) {
        console.log('entrou no if')
        user.todos.splice(data, 1);
        return response.status(200);
      }
    })
    
  }
  
});

module.exports = app;