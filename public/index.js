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

// const API_URL = "http://localhost:7000";

const API_URL = "https://gestor-de-tareas-back.onrender.com";

const TASK_STATUS = {
  PENDING: "PENDING",
  INPROGRESS: "INPROGRESS",
  DONE: "DONE",
  DELETE: "DELETE",
};

let login, draggedTaskId, draggedFromContainerId, draggedToContainerId;

const app = document.querySelector("#app");

const updateCardsButtonsDisplay = () => {
  const pendingButtonsList = document.querySelectorAll(".task-button-pending");
  const inprogressButtonsList = document.querySelectorAll(
    ".task-button-inprogress"
  );
  const doneButtonsList = document.querySelectorAll(".task-button-done");

  pendingButtonsList.forEach((button) => {
    const task = tasks.find(
      (task) => task._id === button.getAttribute("data-id")
    );
    if (task.status.toUpperCase() === TASK_STATUS.PENDING) {
      button.style.display = "none";
    } else {
      button.style.display = "block";
    }
  });

  inprogressButtonsList.forEach((button) => {
    const task = tasks.find(
      (task) => task._id === button.getAttribute("data-id")
    );
    if (task.status.toUpperCase() === TASK_STATUS.INPROGRESS) {
      button.style.display = "none";
    } else {
      button.style.display = "block";
    }
  });

  doneButtonsList.forEach((button) => {
    const task = tasks.find(
      (task) => task._id === button.getAttribute("data-id")
    );
    if (task.status.toUpperCase() === TASK_STATUS.DONE) {
      button.style.display = "none";
    } else {
      button.style.display = "block";
    }
  });
};

const updatePageAfterTaskUpdated = ({ ...params }) => {  
  const clickedTaskId = params.e.target.getAttribute("data-id");
  const clickedTask = document.getElementById(clickedTaskId);
  const taskItem = tasks.find((task) => task._id === clickedTaskId);
  taskItem.status = params.status.toLowerCase();
  const draggedToContainer = document.getElementById(taskItem.status);

  draggedToContainer.insertAdjacentElement("beforeend", clickedTask);

  const statusContainer = clickedTask.children[1];
  statusContainer.innerHTML = `<p><strong>Status: </strong>${taskItem.status}</p>`;

  updateCardsButtonsDisplay();
};

const updateTask = async ({ ...params }) => {  
  try {
    const response = await fetch(
      `${API_URL}/api/tasks/${params.taskItem._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({...params.taskItem,status: params.status.toLowerCase()}),
      }
    );
    const responseJSON = await response.json();
    if (responseJSON.ok && params.e) {      
      updatePageAfterTaskUpdated({ e: params.e, status: params.status });
    }else{
      initTaskButton()
      updateCardsButtonsDisplay();
    }
  } catch (err) {
    console.log(err);
  }
};


const deleteTaskById = async ({ ...params }) => {  
  try {
    const deletedTaskResp = await fetch(
      `${API_URL}/api/tasks/${params.taskItem._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem('token')
        },
      }
    );
    const deletedTaskRespJSON = await deletedTaskResp.json();
    if (deletedTaskRespJSON.ok) {
      const cardToDelete = document.getElementById(params.taskItem._id);
      cardToDelete.parentNode.removeChild(cardToDelete);
    }else{      
      apiResponse = deletedTaskRespJSON
    }
  } catch (err) {
    console.log(err);
  }
};

const updateTaskFromButtonClick = ({ ...params }) => {
  if (params.status === TASK_STATUS.DELETE) {
    params.list.forEach((button) => {
      button.addEventListener("click", (e) => {
        const taskItem = tasks.find(
          (task) => task._id === e.target.getAttribute("data-id")
        );
        deleteTaskById({ taskItem });
      });
    });
  } else {
    params.list.forEach((button) => {
      button.addEventListener("click", (e) => {        
        const taskItem = tasks.find(
          (task) => task._id === e.target.getAttribute("data-id")
        );
        updateTask({ e, taskItem, status: params.status, list: params.list });
      });
    });
  }
};

const initTaskButton = () => {
  const pendingButtonsList = document.querySelectorAll(".task-button-pending");
  updateTaskFromButtonClick({
    status: TASK_STATUS.PENDING,
    list: pendingButtonsList,
  });

  const inprogressButtonsList = document.querySelectorAll(
    ".task-button-inprogress"
  );

  updateTaskFromButtonClick({
    status: TASK_STATUS.INPROGRESS,
    list: inprogressButtonsList,
  });

  const doneButtonsList = document.querySelectorAll(".task-button-done");
  updateTaskFromButtonClick({
    status: TASK_STATUS.DONE,
    list: doneButtonsList,
  });

  const deleteButtonsList = document.querySelectorAll(".task-button-delete");
  updateTaskFromButtonClick({
    status: TASK_STATUS.DELETE,
    list: deleteButtonsList,
  });
};

const parseFromString = (stringElem) => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(stringElem, "text/html");
  return parsedDocument.body.firstChild;
};

const initMenu = () => {
  const menuItems = Array.from(document.querySelectorAll(".menu-items"));
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      for (const item2 of menuItems) {
        item2.classList.remove("active");
      }
      item.classList.add("active");
    });
  });
};

const createTaskItem = (taskItem) => {  
  const elem = parseFromString(`
    <div class="task" draggable="true" id=${taskItem._id}>
      <div class="task-title task-title-${taskItem.status}">
        <p><strong></strong>${taskItem.title}</p>
      </div>
      <div class="task-status">
        <p><strong>Status: </strong>${taskItem.status}</p>
      </div>
      <div class="task-company-code">
        <p><strong>Company Name: </strong>${taskItem.companyCode}</p>
      </div>
      <div class="task-desc">
        <p><strong>Description: </strong>${taskItem.desc}</p>
      </div>
      <div class="task-dev">
        <p><strong>Assignee: </strong>${taskItem.dev}</p>
      </div>
      <div class="task-dates">
        <div class="start-date">
          <strong>Created Date: </strong> ${taskItem.startDate}
        </div>
        <div class="end-date"><strong>Due: </strong> ${taskItem.endDate}</div>
      </div>   
      <div class="task-creator">
        <p><strong>Creator: </strong>${taskItem.createdBy}</p>
      </div>   
      <div class="task-buttons">
          <button data-id=${taskItem._id} class="hidden task-button-pending">Pending</button>
          <button data-id=${taskItem._id} class="hidden task-button-inprogress">In Progress</button>
          <button data-id=${taskItem._id} class="hidden task-button-done">Done</button>
          <button data-id=${taskItem._id} class="task-button-delete">Delete</button>
      </div>
    </div>
  `);

  elem.addEventListener("dragstart", (e) => {
    draggedTaskId = e.target.id;
    draggedFromContainerId = e.target.parentNode.id;
    draggedToContainerId = e.target.parentNode.id
  });

  return elem;
};

const renderTasks = (taskStatus) => {
  const filteredTasks = tasks.filter(
    (task) => task.status.toUpperCase() === taskStatus
  );

  const filteredTasksHTML = filteredTasks.map(createTaskItem);

  const tasksContiner = document.getElementById(taskStatus.toLowerCase());

  filteredTasksHTML.forEach((item) =>
    tasksContiner.insertAdjacentElement("beforeend", item)
  );
};

const toogleTasksRender = () => {
  renderTasks(TASK_STATUS.PENDING);
  renderTasks(TASK_STATUS.INPROGRESS);
  renderTasks(TASK_STATUS.DONE);
};

const tasksFetch = async () => {
  try {
    const fetchedTasks = await fetch(`${API_URL}/api/tasks`,  {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem('token')
      }
    });
    const fetchedTasksJSON = await fetchedTasks.json();
    tasks = fetchedTasksJSON.data;    
    toogleTasksRender();
    updateCardsButtonsDisplay();
    initTaskButton();
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
        authorization: localStorage.getItem('token')
      },
      body: JSON.stringify(params.formTask),
    });
    const apiRespJSON = await apiResp.json();    
    if (apiRespJSON.ok) {      
      tasks.push(apiRespJSON.data);
      const tasksHTML = createTaskItem(apiRespJSON.data);
      const tasksContiner = document.getElementById("pending");
      tasksContiner.insertAdjacentElement("beforeend", tasksHTML);
      updateCardsButtonsDisplay();
      initTaskButton();
    }
  } catch (err) {
    console.log(err);
  }

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
      endDate: moment(inputendDate.value).format('YYYY-MM-DD')
    };

    createFormTask({ formTask, inputTitle, inputDesc, inputDev, inputendDate });
    updateCardsButtonsDisplay();
  } else {
    alert("Please fill all the fields!");
  }
};

const initForm = () => {
  const formButton = document.querySelector("#create-task-button");
  formButton.addEventListener("click", handleFormSubmit);
  const webTitle = document.querySelector('.menu-title')
  webTitle.innerContent = `${localStorage.getItem("username")} - Todos`
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

    container.addEventListener("dragenter", (e) => {
      if (e.target.id) {        
        const draggedEnterContainerId = e.target.id;        
        if (draggedEnterContainerId.toUpperCase() in TASK_STATUS) {
          draggedToContainerId = draggedEnterContainerId;
        }
      }
    });

    container.addEventListener("drop", () => {
      const draggedTaskObject = tasks.find(
        (taskItem) => taskItem._id === draggedTaskId
      );

      const draggedTask = document.getElementById(draggedTaskId);

      const draggedFromContainer = document.getElementById(
        draggedFromContainerId
      );

      if (draggedTaskObject.status !== draggedToContainerId) {        
        draggedFromContainer.removeChild(draggedTask);
        draggedTaskObject.status = draggedToContainerId;

        updateTask({taskItem: draggedTaskObject,status: draggedToContainerId})

        const tasksHTML = createTaskItem(draggedTaskObject);
        const tasksContiner = document.getElementById(draggedToContainerId);
        tasksContiner.insertAdjacentElement("beforeend", tasksHTML);
      }

    });
  });
};

const initLogOut = () => {
  const logout = document.querySelector('#logout')
  logout.addEventListener('click', () => {
    const token = localStorage.getItem("token");
    if(token){
      localStorage.removeItem("token")
      route = 'login'
      redirect()
    }
  })
}

const renderHome = () => {
  app.innerHTML = ""
  const src = document.querySelector("#main-template");
  const srcNode = document.importNode(src.content, true);
  Array.from(srcNode.children).forEach((node) => {
    app.insertAdjacentElement("beforeend", node);
  });

  initMenu();
  initLogOut()
  setContinerDragAndDrop();
  tasksFetch();
  initForm();
  initSubmenu();
};

const clearForm = () => {
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  
  username.value = "";
  password.value = "";
};

const clearSignupForm = () => {
  const username = document.querySelector("#signup-username");
  const password = document.querySelector("#signup-password");
  const companyCode = document.querySelector("#company-code");
  
  username.value = "";
  password.value = "";
  companyCode.value = "";
};

const loginUser = async (user) => { 
  try {
    const resp = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",        
      },
      body: JSON.stringify({ ...user }),
    });
    const respJSON = await resp.json();
    if (respJSON.ok) {
      localStorage.setItem("token", respJSON.data.token);
      if (localStorage.getItem("username")){
        localStorage.removeItem("username")
      }
      localStorage.setItem("username", user.username);
      clearForm();
      route = "home";
      redirect();
    }
  } catch (err) {
    console.log(err);
  }
};

const signupUser = async (user) => { 
  try {
    const resp = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user }),
    });
    const respJSON = await resp.json();
    if (respJSON.ok) {      
      clearSignupForm();
      route = "login";
      redirect();
    }
  } catch (err) {
    console.log(err);
  }
};

const gatherUserInput = (e) => {
  e.preventDefault();
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");  
  if ((username.value.trim().length > 0) & (password.value.trim().length > 0)) {
    const user = {
      username: username.value,
      password: password.value
    };

    loginUser({ ...user });
    // clearForm({username, password})
    // return user;
  } else {
    return alert("Please fill the form fields");
  }
};


const gatherSignupUserInput = (e) => {
  e.preventDefault();
  const username = document.querySelector("#signup-username");
  const password = document.querySelector("#signup-password");
  const companyCode = document.querySelector("#company-code");  
  if ((username.value.trim().length > 0) & (password.value.trim().length > 0)) {
    const user = {
      username: username.value,
      password: password.value,
      companyCode: companyCode.value
    };   
        
    signupUser({ ...user });   

    // clearForm({username, password})
    // return user;
  } else {
    return alert("Please fill the form fields");
  }
};


const initAuthSignup = () => {  
  const bttn = document.querySelector(".signup-btn");
  const navToSignin = document.querySelector("#nav-to-signin");
  bttn.addEventListener("click", gatherSignupUserInput);
  navToSignin.addEventListener('click', () => {    
    route='login'
    redirect()
  })
}

const renderSignupForm = () => {
  app.innerHTML = "";
  const src = document.querySelector("#auth-signup-template");
  const srcNode = document.importNode(src.content, true);
  app.insertAdjacentElement("beforeend", srcNode.firstElementChild);
  initAuthSignup()
}


const initAuthLoginForm = () => {
  const bttn = document.querySelector(".btn");
  const navToSignup = document.querySelector("#nav-to-signup");
  bttn.addEventListener("click", gatherUserInput);
  navToSignup.addEventListener('click', () => {    
    route='signup'
    redirect()
  })
};

const renderAuth = () => {
  app.innerHTML = "";
  const src = document.querySelector("#auth-login-template");
  const srcNode = document.importNode(src.content, true);
  app.insertAdjacentElement("beforeend", srcNode.firstElementChild);
  initAuthLoginForm()
};

const redirect = () => {
  if (route === "login") {    
    renderAuth()
  } else if (route === "signup") {
    renderSignupForm()
  } else if (route === "home") {    
    renderHome();
    // renderOrdersView()
    // initOrdersView()
    // initForm()
  }
};

const checkForToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return true;
  } else {
    return false;
  }
};

window.onload = () => {
  const userAuthenticated = checkForToken();

  // verifica ese tocket con el backend

  if (userAuthenticated) {
    route='home'
    renderHome();    
  } else {
    route='login'    
    redirect();
  }
};
