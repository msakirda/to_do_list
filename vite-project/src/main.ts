const taskInput = document.getElementById('taskInput') as HTMLInputElement;
const addButton = document.getElementById('addButton') as HTMLButtonElement;
const taskList = document.getElementById('taskList') as HTMLUListElement;

// Fonction pour charger les tâches depuis le stockage local
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  const tasks: string[] = storedTasks ? JSON.parse(storedTasks) : [];
  tasks.forEach(task => addTaskToList(task));
}

// Charger les tâches depuis le stockage local 
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromLocalStorage();
});

// Fonction pour ajouter une tâche à la liste
function addTaskToList(taskText: string) {
  const li = document.createElement('li');

   // Coche pour indiquer la réalisation de la tâche
   const checkbox = document.createElement('input');
   checkbox.type = 'checkbox';
   li.appendChild(checkbox);

  // Texte de la tâche
  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;
  li.appendChild(taskSpan);
    // Icône de corbeille 
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt'); 
    deleteIcon.style.cursor = 'pointer'; 
    li.appendChild(deleteIcon);


  
  taskList.prepend(li);

  // le clic sur l'icône de corbeille
  deleteIcon.addEventListener('click', () => {
    removeTaskFromList(li, taskText);
  });

  // le clic sur la coche
  checkbox.addEventListener('click', () => {
    if (checkbox.checked) {
      li.classList.add('task-done');
    } else {
      li.classList.remove('task-done');
    }
  });
}

// Fonction de suppression
function removeTaskFromList(li: HTMLLIElement, taskText: string) {
  taskList.removeChild(li);

  // Récupérer les tâches existantes depuis le stockage local
  const storedTasks = localStorage.getItem('tasks');
  const tasks: string[] = storedTasks && typeof storedTasks === 'string' ? JSON.parse(storedTasks) : [];

  // Supprimer la tâche 
  const taskIndex = tasks.indexOf(taskText);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Appel à l'API pour supprimer la tâche
  fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log('Tâche supprimée de l\'API:', data);
    });
}

// Enregistrer une nouvelle tâche dans le stockage local et sur l'API
addButton.addEventListener('click', () => {
  const newTask = taskInput.value;
  if (newTask !== '') {
    addTaskToList(newTask);

    // Récupérer les tâches existantes depuis le stockage local
    const storedTasks = localStorage.getItem('tasks');
    const tasks: string[] = storedTasks && typeof storedTasks === 'string' ? JSON.parse(storedTasks) : [];

    // Ajouter la nouvelle tâche au début de la liste
    tasks.unshift(newTask);

    // Enregistrer la liste mise à jour dans le stockage local
    localStorage.setItem('tasks', JSON.stringify(tasks));

  
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ title: newTask }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Tâche ajoutée à l\'API:', data);
      });

    taskInput.value = ''; 
  }
});