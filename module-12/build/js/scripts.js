'use strict';
/* 
  Напишите приложение для хранения url веб-страниц в виде карточек-закладок. 
  
  Реализуйте следующий функционал:
    1 Используйте Gulp для сборки проекта, JS обработан транспайлером Babel, ресурсы оптимизированы
    
    2 Для добавления новой закладки, в приложении есть форма с элементом input и кнопкой "Добавить"
    
    3 В приложении есть список всех добавленных карточек-закладок, располагающийся под формой
    
    4 Некоторые элементы интерфейса создаются динамически. Используйте шаблонизатор Handlebars для
      создания списка карточек. Форма уже есть в HTML при загрузке страницы.
      
    5 При добавлении ссылки в поле формы и нажатии на кнопку "Добавить", происходят проверки:
        * на существование закладки с такой ссылкой в текущей коллекции закладок. Если такая закладка есть,
          всплывает диалоговое окно оповещающее пользователя о том, что такая закладка уже есть.
        * при условии валидной, еще не существующей в коллекции ссылки, карточка с такой ссылкой
          добавляется в коллекцию.
          
    6 В интерфейсе, новые карточки добавляются наверх списка, а не вниз.
    
    7 Каждая карточка-закладка содержит кнопку для удаления карточки из коллекции, при клике 
      на кнопку происходит удаление.
      
    8 При повторном посещении страницы с одного и того же устройства и браузера, пользователь видит
      все карточки-закладки которые были во время последнего его посещения. Используйте localStorage
      
  🔔 Оформление интерфейса произвольное
*/

/*
  ⚠️ ЗАДАНИЕ ПОВЫШЕННОЙ СЛОЖНОСТИ - ВЫПОЛНЯТЬ ПО ЖЕЛАНИЮ
  
    - При добавлении ссылки в поле формы и нажатии на кнопку "Добавить", происходи проверка 
      на валидность введенной ссылки: если был введен невалидный url то должно всплывать 
      диалоговое окно, оповещающее пользователя о том, что это невалидный url. Используйте
      регулярные выражения для валидации url.
          
    - Каждая карточка содержит превью изображение и базовую информацию о странице по адресу закладки,
      для получения этой информации воспользуйтесь этим Rest API - https://www.linkpreview.net/
*/
// my key 5ba0169ddad6ed12cf668e216d39d60a742e179cfe78b in https://www.linkpreview.net/

var form = document.querySelector('.js-form');
var inputLink = document.querySelector('input[name=link]');
var inputDescr = document.querySelector('input[name=descr]');
var addBtn = document.querySelector('.form button');
var container = document.querySelector('#root');
var sourse = document.querySelector('#card').innerHTML.trim();

var constants = {
  links: [],
  delBtn: document.querySelector('#root')
};

createTemplateFromLs();

function onClickDel(evt) {

  var target = evt.target;
  var nodeName = target.nodeName;
  var action = target.dataset.action;

  if (nodeName !== 'BUTTON' || action !== 'delete') return;

  var parent = evt.target.parentNode;

  var id = Number(evt.target.parentNode.dataset.id);
  var updatedLinksList = constants.links.filter(function (val) {
    return val.id !== id;
  });
  constants.links = updatedLinksList;
  localStorage.setItem('links', JSON.stringify(constants.links));
  parent.remove();
  console.log('constants.links', constants.links);
}

function onClickAdd(evt) {
  var target = evt.target;
  var action = target.dataset.action;
  if (target.nodeName !== 'BUTTON' || action !== 'add') return;
  evt.preventDefault();

  isEnteredUrlValid();

  form.reset();

  constants.delBtn = document.querySelector('.link-card button');
  localStorage.setItem('links', JSON.stringify(constants.links));
}

function isEnteredUrlValid() {
  var enteredUrl = inputLink.value.trim();
  var isUrlValid = /^((https?|ftp)\:\/\/)/.test(enteredUrl);
  // /^((https?|ftp)\:\/\/)?([a-z0-9]{1})((\.[a-z0-9-])|([a-z0-9-]))*\.([a-z]{2,6})(\/?)$/
  if (!isUrlValid) {
    return alert('Your URL is not valid');
  } else {
    var isValid = function isValid(val) {
      return val.link === inputLink.value.trim();
    };
    var isLinkValid = constants.links.some(isValid);
    if (!isLinkValid) {
      var linksItem = {
        descr: inputDescr.value.trim(),
        link: inputLink.value.trim(),
        id: Date.now()
      };

      constants.links.unshift(linksItem);
      console.log('constants.links:', constants.links);
      createTemplate();constants.links;
    } else {
      return alert('Such a bookmark already exists');
    }
  }
}

function createTemplate() {
  var template = Handlebars.compile(sourse);
  var markup = template(constants.links[0]);
  container.insertAdjacentHTML('afterbegin', markup);
}

function createTemplateFromLs() {
  var linksFromLs = JSON.parse(localStorage.getItem('links'));
  if (linksFromLs !== null) {
    constants.links = linksFromLs;
    var template = Handlebars.compile(sourse);
    var markup = constants.links.reduce(function (acc, item) {
      return acc + template(item);
    }, '');
    container.insertAdjacentHTML('afterbegin', markup);
  };
}

addBtn.addEventListener('click', onClickAdd);
constants.delBtn.addEventListener('click', onClickDel);