//Constants for HTML items that will be used in JS code
const listsContainer = document.querySelector('#all_lists'); 
const makeNewListForm = document.querySelector('#add_list_form'); 
const newListInput = document.querySelector('#add_list_input');
const deleteListButton = document.querySelector('#delete_list_button'); 
const listDisplayContainer = document.querySelector('#selected_list_container');
const listTitleElement = document.querySelector('#selected_list_title');
const tasksContainer = document.querySelector('#selected_list_tasks');
const makeNewTaskForm = document.querySelector('#add_task_form');
const newTaskInput = document.querySelector('#add_task_input');   
const clearCompleteTasksButton = document.querySelector('#delete_task_button'); 

//Four lines of code below are to properly use local storage 
const listKey = 'allLists'; //Key for lists in local storage
const currListKey = 'currListId'; //Key for selected list id in local storage
let lists = JSON.parse(localStorage.getItem(listKey)) || []; //Makes a lists object from a json of the current available lists
let currListId = localStorage.getItem(currListKey); //Makes an id variable from local storage chosen list

//Adds click event listener for container of all lists. This is used to determine the currently chosen list
listsContainer.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'li') {
    currListId = event.target.dataset.listId; //Sets currListId to id of currently chosen list
    updateLists();
    }
})

//Adds click event listener for tasks 
tasksContainer.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'input') {
    let currList = undefined; //Variable in which current list object will be stored
    //For loop is used to find the currently selected list. Could have been implemented using find function
    for(let i = 0; i < lists.length; i++){
      if(lists[i].id === currListId){
        currList = lists[i];
      }
    }
    const currTask = currList.tasks.find(task => task.id === event.target.id);
    currTask.complete = event.target.checked;
    updateLists();
  }
})

//This function is used to clear completed tasks in the current list
clearCompleteTasksButton.addEventListener('click', function(event) {
  let currList = undefined; 
  for(let i = 0; i < lists.length; i++){
    if(lists[i].id === currListId){
      currList = lists[i];
    }
  }
  currList.tasks = currList.tasks.filter(task => !task.complete); //Will create new tasks array with only tasks that are not completed
  updateLists();
})

//Function to delete selected items
deleteListButton.addEventListener('click', function(event) {
  for(let i = 0; i < lists.length; i++){ 
    if(lists[i].id === currListId){ //Checks if the list id is equal to the id of the selected list
      lists.splice(i, 1); //Splice method removes current item from array and new array is formed. Could use filter function too
    }
  }
  currListId = null; //Resets selected list id to null
  updateLists();
})

//Event listener for when form to add new list is submitted
makeNewListForm.addEventListener('submit', function(event) {
  event.preventDefault(); //Prevents list from submitting right away
  const newListName = newListInput.value; //Stores value os newListInput into constant to be used later
 
  //Checks if user typed something of lenght 1 or greater inside of form to add new list
  if(newListName.length > 0){
    //Saves list object into list constant. List objects contain an id(random number), name, and tasks array
    const list = { id: Math.floor((Math.random() * 1000) + 1).toString(), name: newListName, tasks: [] }; 
    newListInput.value = null; //Clears form
    lists.push(list); //Adds new list to lists array
    updateLists();
  }
})

//Event listener for when form to add new task is submitted. Similar to makeNewListForm so I will not go into much detail
makeNewTaskForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const newTaskName = newTaskInput.value;
  if(newTaskName.length > 0){  
  const task = { id: Math.floor((Math.random() * 1000) + 1).toString(), name: newTaskName, complete: false };
  newTaskInput.value = null;
  const currList = lists.find(list => list.id === currListId);
  currList.tasks.push(task);
  updateLists();
  }
})

//Function that clears all elements within 
function clearItems(item) {
  while (item.firstChild) { //Checks to see if item has an element inside
    item.removeChild(item.firstChild); //Removes first element from item array
  }
}

//Function to render contents of webpage if something changes
function updateLists() {
  //Stores lists and selected list key in browsers local storage
  localStorage.setItem(listKey, JSON.stringify(lists)); 
  localStorage.setItem(currListKey, currListId);

  clearItems(listsContainer); //Clears lists from list container to be repopulated 
  displayLists();

  let currList = undefined; 
  for(let i = 0; i < lists.length; i++){
    if(lists[i].id === currListId){
      currList = lists[i];
    }
  }
   if (currListId != null) {
    listDisplayContainer.style.display = '';
    listTitleElement.innerText = currList.name;
    clearItems(tasksContainer);
    displayTasks(currList);
  } else {
    listDisplayContainer.style.display = 'none';
  }
}

//Function that creates HTML that will be used to add tasks into the task container
function createTasksInHTML(){
//Create HTML elements in which tasks will be added
let taskDiv = document.createElement("div");
let taskInput = document.createElement("input");
let taskInputLabel = document.createElement("label");
let taskInputLabelSpan = document.createElement("span");

taskDiv.className = "task"; //Add class to div that was created
taskInput.setAttribute('type', 'checkbox'); //Add checkbox attribute to input
taskInputLabelSpan.className = "my_checkbox"; //Add class to span within label

taskInputLabel.appendChild(taskInputLabelSpan); //Add span to label
taskDiv.appendChild(taskInput); //Adds input into div 
taskDiv.appendChild(taskInputLabel); //Adds label into div

return taskDiv;
}

//Function that loads and displays the tasks within a list 
function displayTasks(currList) {
  //This for loop is to run through the entire tasks array
  for(let j = 0; j < currList.tasks.length; j++){
    const individualElement = createTasksInHTML(); //Calls createTasksHTML function to save div into constant
    
    //This is just for testing
    console.log(individualElement); 

    const checkbox = individualElement.querySelector('input'); //Gets input
    checkbox.id = currList.tasks[j].id; //Sets checkbox id 
    checkbox.checked = currList.tasks[j].complete; //Sets checkbox checkdd property
    const label = individualElement.querySelector('label'); //Gets label
    label.htmlFor = currList.tasks[j].id; 
    label.append(currList.tasks[j].name); 
    tasksContainer.appendChild(individualElement); //Appends updated div into tasksContainer
  }
}

//Function that loads and displays the list that contains all other lists 
function displayLists() {
  //This for loop is to run through the entire lists array
  for(let i = 0; i < lists.length; i++){ 
    const individualList = document.createElement('li'); //Creates an li in which a single list name will go in
    individualList.dataset.listId = lists[i].id; //Adds an id to each list in lists object array. This will be used to keep track of which list is currently
    individualList.classList.add("all_lists_names"); //Adds a class name of "list-name" to each list 
    individualList.innerText = lists[i].name; //Sets text in html to given list name in lists array
    if (lists[i].id === currListId) {
      individualList.classList.add('current_list');
    }
    listsContainer.appendChild(individualList); //Adds single list name to the end of the listsContainer array
  }
}

//This function is to render the current date
function updateCurrentDate() {
  let currDate = new Date();
  let year = currDate.getFullYear();

  let month = currDate.getMonth();
  let day = currDate.getDate();

  let monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

  let currentDate = document.getElementById("current_date");
  currentDate.innerText = "" + monthArray[month] + " " + day + ", " + year;
}

updateCurrentDate();

updateLists();