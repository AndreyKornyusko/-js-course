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
// my key 5ba0af33f2af89d0737b612698e2451865b0a0af180af in https://www.linkpreview.net/

const form = document.querySelector('.js-form');
const inputLink = document.querySelector('input[name=link]');
const addBtn = document.querySelector('.form button');
const container = document.querySelector('#root');
const sourse = document.querySelector('#card').innerHTML.trim();
const delBtn = document.querySelector('#root');

addBtn.addEventListener('click', onClickAdd);
delBtn.addEventListener('click', onClickDel);

const constants = {
  links: [],
};

createTemplateFromLs();

function onClickDel(evt) {

  const target = evt.target;
  const nodeName = target.nodeName;
  const action = target.dataset.action;

  if (nodeName !== 'BUTTON' || action !== 'delete') return;

  const parent = evt.target.closest('.link-card');

  const id = Number(evt.target.parentNode.dataset.id);
  const updatedLinksList = constants.links.filter(val=>val.id!==id);
  constants.links = updatedLinksList;
  setLocalStorage();
  parent.remove();
  console.log('constants.links',constants.links);
}

function onClickAdd(evt) {
  const target = evt.target;
  const action = target.dataset.action;
  if (target.nodeName !== 'BUTTON'||action !== 'add') return;
  evt.preventDefault();

  if (!isEnteredUrlValid()) {
    form.reset();
    return
  };
  
  getLinkData().then(data =>{
    console.log('data',data);

    const linksItem = {
    link: inputLink.value.trim(),
    id: Date.now(),
    img: data.image,
    title: data.title,
    };

    constants.links.unshift(linksItem);
    createTemplate();
    console.log('constants.links:', constants.links);

    setLocalStorage();
    form.reset();
  });

}

function isEnteredUrlValid() {
  const enteredUrl = inputLink.value.trim();
  const isUrlValid = /^((https?|ftp)\:\/\/)/.test(enteredUrl);
  const isValid = val => val.link === inputLink.value.trim();
  const isLinkValid = constants.links.some(isValid);

  if (!isUrlValid) {
    alert('Your URL is not valid');
    return false;
  };
  if (isLinkValid) {
    alert('Such a bookmark already exists');
    return false;
  }

  return true;
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
    console.log('templete from ls',template);
    const markup = constants.links.reduce((acc,item)=>acc + template(item),'');
    container.insertAdjacentHTML('afterbegin', markup);
  };
}

function getLinkData() {
  const apiKey = '5ba0af33f2af89d0737b612698e2451865b0a0af180af';
  const getLink = inputLink.value.trim();
  const url = `https://api.linkpreview.net/?key=${apiKey}&q=${getLink}`;
   
  return fetch(url)
  .then(response =>{
    console.log('response.json()', response.json);
    if(response.ok) {return response.json()};

    throw new Error(`Error while fetching: ${response.statusText}`);
  })
  .catch(error => console.log(error));
}

function setLocalStorage() {
  localStorage.setItem('links',JSON.stringify(constants.links));
}
