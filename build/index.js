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

const form = document.querySelector('.js-form');
const inputLink = document.querySelector('input[name=link]');
const inputDescr = document.querySelector('input[name=descr]');
const addBtn = document.querySelector('.form button');
const container = document.querySelector('#root');
const sourse = document.querySelector('#card').innerHTML.trim();


const constants = {
  links: [],
  delBtn:document.querySelector('#root'),
};


createTemplateFromLs();

function onClickDel(evt) {

  const target = evt.target;
  const nodeName = target.nodeName;
  const action = target.dataset.action;

  if (nodeName !== 'BUTTON' || action !== 'delete') return;

  const parent = evt.target.parentNode;

  const id = Number(evt.target.parentNode.dataset.id);
  const updatedLinksList = constants.links.filter(val=>val.id!==id);
  constants.links = updatedLinksList;
  localStorage.setItem('links',JSON.stringify(constants.links));
  parent.remove();
  console.log('constants.links',constants.links);
}

function onClickAdd(evt) {
  const target = evt.target;
  const action = target.dataset.action;
  if (target.nodeName !== 'BUTTON'||action !== 'add') return;
  evt.preventDefault();
  
  isEnteredUrlValid();

  form.reset();

  constants.delBtn = document.querySelector('.link-card button');
  localStorage.setItem('links',JSON.stringify(constants.links));
  
}

function isEnteredUrlValid() {
  const enteredUrl = inputLink.value.trim();
  const isUrlValid = /^((https?|ftp)\:\/\/)/.test(enteredUrl);
  // /^((https?|ftp)\:\/\/)?([a-z0-9]{1})((\.[a-z0-9-])|([a-z0-9-]))*\.([a-z]{2,6})(\/?)$/
  if (!isUrlValid) {
    return alert('Your URL is not valid');
  } else {
    const isValid = val => val.link === inputLink.value.trim();
    const isLinkValid = constants.links.some(isValid);
    if (!isLinkValid) {
      const linksItem = {
        descr: inputDescr.value.trim(),
        link: inputLink.value.trim(),
        id: Date.now(),
      };

      constants.links.unshift(linksItem);
      console.log('constants.links:', constants.links);
      createTemplate();constants.links
    } else {
      return alert('Such a bookmark already exists');
    }
  }
}

function createTemplate() {
  const template = Handlebars.compile(sourse);
  const markup = template(constants.links[0]);
  container.insertAdjacentHTML('afterbegin', markup);
}

function createTemplateFromLs() {
  const linksFromLs = JSON.parse(localStorage.getItem('links'));
  if(linksFromLs !== null){
    constants.links = linksFromLs;
    const template = Handlebars.compile(sourse);
    const markup = constants.links.reduce((acc,item)=>acc + template(item),'');
    container.insertAdjacentHTML('afterbegin', markup);
  };
}

addBtn.addEventListener('click', onClickAdd);
constants.delBtn.addEventListener('click', onClickDel);