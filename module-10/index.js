'use strict';

/*
  Написать приложение для работы с REST сервисом, 
  все функции делают запрос и возвращают Promise 
  с которым потом можно работать. 
  
  Реализовать следующий функционал:
  - функция getAllUsers() - должна вернуть текущий список всех пользователей в БД.
  
  - функция getUserById(id) - должна вернуть пользователя с переданным id.
  
  - функция addUser(name, age) - должна записывать в БД юзера с полями name и age.
  
  - функция removeUser(id) - должна удалять из БД юзера по указанному id.
  
  - функция updateUser(id, user) - должна обновлять данные пользователя по id. 
    user это объект с новыми полями name и age.
  Документацию по бэкенду и пример использования прочитайте 
  в документации https://github.com/trostinsky/users-api#users-api.
  Сделать минимальный графический интерфейс в виде панели с полями и кнопками. 
  А так же панелью для вывода результатов операций с бэкендом.
*/

const inputId = document.querySelector('input[name=user-id]');
const inputUserName = document.querySelector('input[name=user-name]');
const inputUserAge = document.querySelector('input[name=user-age]');
const submitButtons = document.querySelector('.buttons');
const result = document.querySelector('.js-result');

submitButtons.addEventListener('click', onClick);

function onClick(evt) {
  evt.preventDefault();
  let target = evt.target;

  if (target.classList.contains('js-submit')) {
    getAllUsers(evt);
  } else if (target.classList.contains('js-submit-id')) {
    getUserById(evt);
  } else if (target.classList.contains('js-submit-add-user')) {
    addUser(evt);
  } else if (target.classList.contains('js-submit-remove-user')) {
    removeUser(evt);
  } else if (target.classList.contains('js-submit-update-user')) {
    updateUser(evt);
  }
}

// должна вернуть текущий список всех пользователей в БД.
function getAllUsers(evt) {
  fetch('https://test-users-api.herokuapp.com/users/')
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Error fetching data');
    })
    .then(data => {
      result.textContent = JSON.stringify(data);
    })
    .catch(error => {
      console.error('Error: ', error);
    });
}

// должна вернуть пользователя с переданным id
function getUserById(evt, id) {
  id = inputId.value.trim();
  if (id === '') return alert('Заполните поле id!!!');

  fetch('https://test-users-api.herokuapp.com/users/' + id)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Error fetching data');
    })
    .then(data => {
      console.log('data', data);
      if (data.status !== 200) {
        alert('No such user!');
      }
      result.textContent = JSON.stringify(data);
    })
    .catch(error => {
      console.error('Error: ', error);
    });
}

// должна записывать в БД юзера с полями name и age
function addUser(evt, name, age) {
  name = inputUserName.value.trim();
  age = inputUserAge.value.trim();
  if (name === '' || age === '') return alert('Поля name и age должны быть заполнены!!!');

  const newPost = {
    name,
    age,
  };

  fetch('https://test-users-api.herokuapp.com/users/', {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(data => {
      result.textContent = JSON.stringify(data);
    })
    .catch(error => console.log('ERROR' + error));
}

// должна удалять из БД юзера по указанному id.
function removeUser(evt, id) {
  id = inputId.value.trim();
  if (id === '') return alert('Заполните поле id!!!');

  fetch('https://test-users-api.herokuapp.com/users/' + id, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Error fetching data');
    })
    .then(data => {
      console.log('data', data);
      if (data.status !== 200) {
        return alert('No such user!');
      }
      alert(`Пользователь с id=${id} успешно удален`);
      result.textContent = JSON.stringify(data);
    })
    .catch(error => console.log('ERROR' + error));
}

// должна обновлять данные пользователя по id
function updateUser(evt, id, user) {
  id = inputId.value.trim();

  const name = inputUserName.value.trim();
  const age = inputUserAge.value.trim();
  if (id === '' || name === '' || age === '')
    return alert('Заполните все поля!!!');

  user = {
    name,
    age,
  };

  fetch('https://test-users-api.herokuapp.com/users/' + id, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.status !== 200) {
        return alert('No such user!');
      }
      alert(`User with id=${id} was succsessfully updated`);
      result.textContent = JSON.stringify(data);
    })
    .catch(error => console.log('ERROR' + error));
}