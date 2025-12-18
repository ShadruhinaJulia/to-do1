
let items = [ 
	"Сделать проектную работу", 
	"Полить цветы", 
	"Пройти туториал по Реакту", 
	"Сделать фронт для своего проекта", 
	"Прогуляться по улице в солнечный день", 
	"Помыть посуду", 
]; 

// Находим нужные элементы на странице (в HTML) по CSS-классам
const listElement = document.querySelector(".to-do__list") // задачи
const formElement = document.querySelector(".to-do__form") // форма добавления новой задачи
const inputElement = document.querySelector(".to-do__input") // ввод текста

// Функция, которая загружает задачи - либо из localStorage, либо из начального массива
function loadTasks() { 
	const savedTasks = localStorage.getItem("tasks") // берём из localStorage строку по ключу "tasks" (или null)
	if (savedTasks) { // если есть
		return JSON.parse(savedTasks) // превращаем JSON-строку в массив и возвращ
	} 
	return items 
} 

// Функция созд DOM-элемент задачи из HTML-шаблона
// Принимает item - возвращает готовый элемент
function createItem(item) { //  item — текст задачи
	const template = document.getElementById("to-do__item-template") // находим <template> по id
	const clone = template.content.querySelector(".to-do__item").cloneNode(true) // элемент задачи из шаблона клон
	const textElement = clone.querySelector(".to-do__item-text") // в клон находим элемент, где будет текст задачи
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete") // находим кнопку "удалить"
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate") // "дублировать"
	const editButton = clone.querySelector(".to-do__item-button_type_edit") // "редактировать"

	
	textElement.textContent = item // записываем текст задачи 

	// Обработчик на кнопку удаления
	deleteButton.addEventListener("click", function() { 
		clone.remove() // удаляем задачу 
		const items = getTasksFromDOM() // собираем все текущие задачи со страницы в массив
		saveTasks(items) // сохраняем этот массив в localStorage
	}) 

	// Обработчик на кнопку дублирования
	duplicateButton.addEventListener("click", function() { 
		const itemName = textElement.textContent // берём текст текущей задачи
		const newItem = createItem(itemName) // создаём новую задачу с таким же текстом
		listElement.prepend(newItem) // добавляем копию задачи в начало списка
		const items = getTasksFromDOM() 
		saveTasks(items) 
	}) 

	// Обработчик на кнопку редактирования
	editButton.addEventListener("click", function() { 
		textElement.contentEditable = true // разрешаем редактировать текст прямо на странице
		textElement.focus() // ставим курсор для печати
	}) 

	// Когда пользователь закончил редактировать (ушёл фокусом с текста)
	textElement.addEventListener("blur", function() { // blur эл т вне фокуса
		textElement.contentEditable = false // запрещаем дальше редактировать
		const items = getTasksFromDOM() 
		saveTasks(items) 
	}) 

	return clone // возвращаем готовый DOM-элемент задачи
} 

// Считывает текущие задачи с страницы и возвращает их как массив строк
function getTasksFromDOM() { // считываем задачи из dom
	const itemsNamesElements = document.querySelectorAll(".to-do__item-text") // находим  эл ты с текстом задач
	const tasks = [] // пустой массив
	itemsNamesElements.forEach(function(element) { // перебираем каждый элемент с текстом
		tasks.push(element.textContent) // добавляем текст элемента в массив tasks
	}) 
	return tasks 
} 

// Сохраняет массив задач в localStorage 
function saveTasks(tasks) { 
	localStorage.setItem("tasks", JSON.stringify(tasks)) // превращаем массив в JSON-строку и сохраняем по ключу "tasks"
} 

items = loadTasks() // берём сохранённые задачи или стартовые

// Перебираем массив items и создаём для каждой задачи DOM-элемент
items.forEach(function(item) { 
	const taskElement = createItem(item) // создаём DOM-элемент задачи по тексту
	listElement.append(taskElement) // добавляем задачу в конец списка на странице
}); 

// Обработчик отправки формы (когда добавляют новую задачу)
formElement.addEventListener("submit", function(event) { // при отправке формы (Enter/кнопка)
	event.preventDefault() // отменяем перезагрузку страницы 

	const newTask = inputElement.value // берём текст введенный в поле

	// Проверяем: если пусто или только пробелы — не добавляем
	if (!newTask || !newTask.trim()) { 
		inputElement.value = "" // очищаем поле
		return 
	} 

	const taskElement = createItem(newTask) // создаём элемент задачи из введённого текста
	listElement.prepend(taskElement) // добавляем новую задачу в начало списка

	items = getTasksFromDOM() // обновляем переменную items: собираем список задач с DOM
	saveTasks(items) 

	inputElement.value = "" // очищаем поле ввода после добавления
}) 
