// let tasks = [
//   {
//     _id: "1abc",
//     title: "Learn React",
//     desc: "I need to practice React more",
//     dev: "Carlos",
//     startDate: "2023-01-01",
//     endDate: "2023-01-30",
//     status: "done",
//   },
//   {
//     _id: "2abc",
//     title: "Learn Mongo",
//     desc: "I need to practice Mongo more",
//     dev: "Jhon",
//     startDate: "2023-01-01",
//     endDate: "2023-01-30",
//     status: "inprogress",
//   },
//   {
//     _id: "3abc",
//     title: "Learn Expressjs",
//     desc: "I need to practice Expressjs more",
//     dev: "Mark",
//     startDate: "2023-01-01",
//     endDate: "2023-01-30",
//     status: "pending",
//   },
// ];

let tasks = [];

// const API_URL = "http://localhost:3000";

const API_URL = "https://gestor-de-tareas-back.onrender.com";

const TASK_STATUS = {
  PENDING: "PENDING",
  INPROGRESS: "INPROGRESS",
  DONE: "DONE",
};

let draggedTaskId, draggedFromContainerId, draggedToContainerId;


const updateCardsButtonsDisplay = () => {
  const pendingButtonsList = document.querySelectorAll('.task-button-pending')
  const inprogressButtonsList = document.querySelectorAll('.task-button-inprogress')
  const doneButtonsList = document.querySelectorAll('.task-button-done')

  pendingButtonsList.forEach(button => {
    const task = tasks.find(task => task._id === button.getAttribute('data-id'))
    if (task.status.toUpperCase() === TASK_STATUS.PENDING) {
      button.style.display = 'none'
    }else {
      button.style.display = 'block'
    }
 
  })

  inprogressButtonsList.forEach(button => {
    const task = tasks.find(task => task._id === button.getAttribute('data-id'))
    if (task.status.toUpperCase() === TASK_STATUS.INPROGRESS) {
      button.style.display = 'none'
    }else {
      button.style.display = 'block'
    }
 
  })

  doneButtonsList.forEach(button => {
    const task = tasks.find(task => task._id === button.getAttribute('data-id'))
    if (task.status.toUpperCase() === TASK_STATUS.DONE) {
      button.style.display = 'none'
    }else {
      button.style.display = 'block'
    }
 
  })
  
}

const updateTaskFromButtonClick = ({ ...params }) => {  
  params.list.forEach(button => {
    button.addEventListener('click', e => {      
      const clickedTaskId = e.target.getAttribute('data-id')      
      const clickedTask = document.getElementById(clickedTaskId)
      taskItem = tasks.find(task => task._id === clickedTaskId)
      taskItem.status = params.status.toLowerCase()
      const draggedToContainer = document.getElementById(taskItem.status)    

      draggedToContainer.insertAdjacentElement('beforeend',clickedTask)

      const statusContainer = clickedTask.children[1]
      statusContainer.innerHTML = `<p><strong>Status: </strong>${taskItem.status}</p>`     

      updateCardsButtonsDisplay()
    })
  })
}

const initTaskButton = () => {
  // task-button-pending
  // task-button-inprogress
  // task-button-done
  const pendingButtonsList = document.querySelectorAll('.task-button-pending')
  updateTaskFromButtonClick({ status: TASK_STATUS.PENDING, list: pendingButtonsList })

  const inprogressButtonsList = document.querySelectorAll('.task-button-inprogress')
  updateTaskFromButtonClick({ status: TASK_STATUS.INPROGRESS, list: inprogressButtonsList })

  const doneButtonsList = document.querySelectorAll('.task-button-done')
  updateTaskFromButtonClick({ status: TASK_STATUS.DONE, list: doneButtonsList })

}


const parseFromString = (stringElem) => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(stringElem, "text/html");
  return parsedDocument.body.firstChild;
};

// menu interaction
const menuItems = Array.from(document.querySelectorAll(".menu-items"));
menuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    for (const item2 of menuItems) {
      item2.classList.remove("active");
    }
    item.classList.add("active");    
  });
});


const createTaskItem = (taskItem) => {
  const elem = parseFromString(`
    <div class="task" draggable="true" id=${taskItem._id}>
      <div class="task-title task-title-${taskItem.status}">
        <p><strong></strong>${taskItem.title}</p>
      </div>
      <div class="task-status">
        <p><strong>Status: </strong>${taskItem.status}</p>
      </div>
      <div class="task-desc">
        <p><strong>Desc: </strong>${taskItem.desc}</p>
      </div>
      <div class="task-dev">
        <p><strong>Dev: </strong>${taskItem.dev}</p>
      </div>
      <div class="task-dates">
        <div class="start-date">
          <strong>Created Date: </strong> ${taskItem.startDate}
        </div>
        <div class="end-date"><strong>Due: </strong> ${taskItem.endDate}</div>
      </div>  
      <div class="task-buttons">
          <button data-id=${taskItem._id} class="hidden task-button-pending">Pending</button>       
          <button data-id=${taskItem._id} class="hidden task-button-inprogress">In Progress</button>        
          <button data-id=${taskItem._id} class="hidden task-button-done">Done</button>
      </div>
    </div>          
  `);

  // when a task is dragged, we'll get it's id and it's current container's id
  elem.addEventListener("dragstart", (e) => {
    draggedTaskId = e.target.id;    
    draggedFromContainerId = e.target.parentNode.id
  });

  return elem;
};

const renderTasks = (taskStatus) => {
  const filteredTasks = tasks.filter(
    (task) => task.status.toUpperCase() === taskStatus
  );

  const filteredTasksHTML = filteredTasks.map(createTaskItem);
  
  const tasksContiner = document.getElementById(taskStatus.toLowerCase());

  // tasksContiner.innerHTML = ''
  filteredTasksHTML.forEach((item) =>
    tasksContiner.insertAdjacentElement("beforeend", item)
  );
};

const toogleTasksRender = () => {
  renderTasks(TASK_STATUS.PENDING);
  renderTasks(TASK_STATUS.INPROGRESS);
  renderTasks(TASK_STATUS.DONE);
  // console.log(task)
};


const tasksFetch = async () => {
  try {
    const fetchedTasks = await fetch(`${API_URL}/api/tasks`);
    const fetchedTasksJSON = await fetchedTasks.json();
    // console.log(fetchedTasksJSON.data);
    tasks = fetchedTasksJSON.data;
    toogleTasksRender();
    initTaskButton()
    updateCardsButtonsDisplay()    
  } catch (err) {
    console.log(err);
  }
};

const createFormTask = async ({ ...params }) => {
  try {
    const apiResp = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params.formTask),
    });
    if (apiResp.ok) {
      console.log("Task Created");
    }
  } catch (err) {
    console.log(err);
  }

  // clear form
  params.inputTitle.value = "";
  params.inputDesc.value = "";
  params.inputDev.value = "";
  params.inputendDate.value = "";
};

const handleFormSubmit = () => {
  const inputTitle = document.querySelector("#form-task-title");
  const inputDesc = document.querySelector("#form-task-desc");
  const inputDev = document.querySelector("#form-task-dev");
  const inputendDate = document.querySelector("#form-task-enddate");

  if (
    inputTitle.value.trim().length > 0 ||
    inputDesc.value.trim().length > 0 ||
    inputDev.value.trim().length > 0 ||
    inputendDate.value.trim().length > 0
  ) {
    const formTask = {
      title: inputTitle.value,
      desc: inputDesc.value,
      dev: inputDev.value,
      endDate: inputendDate.value,
    };

    createFormTask({ formTask, inputTitle, inputDesc, inputDev, inputendDate });
    updateCardsButtonsDisplay()
  } else {
    alert("Please fill all the fields!");
  }
};

const initForm = () => {
  const formButton = document.querySelector("#create-task-button");
  formButton.addEventListener("click", handleFormSubmit);
};

const initSubmenu = () => {
  const submenu = Array.from(document.querySelectorAll(".submenu-items"));
  const submenuForSections = {
    submenuPending: "pending",
    submenuInprogress: "inprogress",
    submenuDone: "done",
    submenuForm: "formContainer",
  };

  submenu.forEach((submenuItem) => {
    submenuItem.addEventListener("click", (e) => {     
      const sectionElem = document.getElementById(
        submenuForSections[e.target.id]
      );
      const sections = Array.from(
        document.querySelectorAll(".drag-drop-container")
      );
      sections.forEach((section) => (section.style.display = "none"));
      sectionElem.style.display = "block";
    });
  });
};


const setContinerDragAndDrop = () => {
  const containers = document.querySelectorAll(".drag-drop-container");

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    /*get the containerId who will received the dagged card when dragenter*/
    container.addEventListener("dragenter", (e) => {
      const draggedEnterContainerId = e.target.id;
      const status = draggedEnterContainerId.toUpperCase();
      if (status in TASK_STATUS) {        
        draggedToContainerId = draggedEnterContainerId;
      }
    });

    container.addEventListener("drop", () => {
      //get task object
      const draggedTaskObject = tasks.find(
        (taskItem) => taskItem._id === draggedTaskId
      );

      //get html task
      const draggedTask = document.getElementById(draggedTaskId);

      //get draggedFromContainer
      const draggedFromContainer = document.getElementById(draggedFromContainerId);           

      //verify the task was dropped on a container different than its current container
      if (draggedTaskObject.status !== draggedToContainerId) {
        
        draggedFromContainer.removeChild(draggedTask);
        draggedTaskObject.status = draggedToContainerId;        

        // get this object to prepare the card and add it to the draggedToContainer locating it by its draggedToContainerId
        const tasksHTML = createTaskItem(draggedTaskObject);        
        const tasksContiner = document.getElementById(draggedToContainerId);
        tasksContiner.insertAdjacentElement("beforeend", tasksHTML);
      }

      updateCardsButtonsDisplay()
    });
  });
};

const handleWindowsOnLoad = () => {  
  setContinerDragAndDrop();
  tasksFetch();
  initForm();
  initSubmenu();
};

window.onload = handleWindowsOnLoad;
