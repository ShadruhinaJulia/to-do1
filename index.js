
let items = [ 
	"Сделать проектную работу", 
	"Полить цветы", 
	"Пройти туториал по Реакту", 
	"Сделать фронт для своего проекта", 
	"Прогуляться по улице в солнечный день", 
	"Помыть посуду", 
]; 

// Находим нужные элементы на странице (в HTML) по CSS-классам
const listElement = document.querySelector(".to-do__list") 
const formElement = document.querySelector(".to-do__form") 
const inputElement = document.querySelector(".to-do__input") 

// Функция, которая загружает задачи - либо из localStorage, либо из начального массива
function loadTasks() { 
	const savedTasks = localStorage.getItem("tasks") 
	if (savedTasks) { 
		return JSON.parse(savedTasks) 
	} 
	return items 
} 

// Функция созд DOM-элемент задачи из HTML-шаблона
function createItem(item) { //  item — текст задачи
	const template = document.getElementById("to-do__item-template") 
	const clone = template.content.querySelector(".to-do__item").cloneNode(true) // элемент задачи из шаблона клон
	const textElement = clone.querySelector(".to-do__item-text") 
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete") // находим кнопку "удалить"
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate") // "дублировать"
	const editButton = clone.querySelector(".to-do__item-button_type_edit") // "редактировать"

	
	textElement.textContent = item // записываем текст задачи 

	// Обработчик на кнопку удаления
	deleteButton.addEventListener("click", function() { 
		clone.remove() // удаляем задачу 
		const items = getTasksFromDOM() 
		saveTasks(items) 
	}) 

	// Обработчик на кнопку дублирования
	duplicateButton.addEventListener("click", function() { 
		const itemName = textElement.textContent 
		const newItem = createItem(itemName) 
		listElement.prepend(newItem) 
		const items = getTasksFromDOM() 
		saveTasks(items) 
	}) 

	// Обработчик на кнопку редактирования
	editButton.addEventListener("click", function() { 
		textElement.contentEditable = true 
		textElement.focus() 
	}) 

	// Когда пользователь закончил редактировать (ушёл фокусом с текста)
	textElement.addEventListener("blur", function() { 
		textElement.contentEditable = false 
		const items = getTasksFromDOM() 
		saveTasks(items) 
	}) 

	return clone 
} 

// Считывает текущие задачи с страницы и возвращает их как массив строк
function getTasksFromDOM() { // считываем задачи из dom
	const itemsNamesElements = document.querySelectorAll(".to-do__item-text") // находим  эл ты с текстом задач
	const tasks = [] // пустой массив
	itemsNamesElements.forEach(function(element) { 
		tasks.push(element.textContent) 
	}) 
	return tasks 
} 

// Сохраняет массив задач в localStorage 
function saveTasks(tasks) { 
	localStorage.setItem("tasks", JSON.stringify(tasks)) // превращаем массив в JSON-строку и сохраняем по ключу "tasks"
} 

items = loadTasks() 

// Перебираем массив items и создаём для каждой задачи DOM-элемент
items.forEach(function(item) { 
	const taskElement = createItem(item) 
	listElement.append(taskElement) 
}); 

// Обработчик отправки формы (когда добавляют новую задачу)
formElement.addEventListener("submit", function(event) { 
	event.preventDefault()

	const newTask = inputElement.value 

	// Проверяем: если пусто или только пробелы — не добавляем
	if (!newTask || !newTask.trim()) { 
		inputElement.value = "" 
		return 
	} 

	const taskElement = createItem(newTask) 
	listElement.prepend(taskElement) 

	items = getTasksFromDOM() 
	saveTasks(items) 

	inputElement.value = "" 
}) 
