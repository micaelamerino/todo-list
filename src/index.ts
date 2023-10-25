import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string,
  title: string,
  createDate: Date
};

const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const list = document.querySelector<HTMLUListElement>("#list");
const main = document.getElementById("main");
const footer = document.createElement("div");
footer.className = "footer-list";

let tasks: Task[] = loadTasks();

form?.addEventListener("submit", e => {
  e.preventDefault();

  if (input?.value == "" || input?.value == null) return

  const newTask: Task = {
    id: uuidv4(),
    title: input.value,
    createDate: new Date()
  }
  tasks.unshift(newTask)
  saveTasks()
  printList(tasks);
  input.value = "";
  input.focus()
});

function printList(tasks: any) {
  if (list != null) {
    list.innerHTML = ""
  }

  tasks.forEach((element: Task) => {
    footer.innerHTML = ""
    const item = document.createElement("li");
    const btnDelete = document.createElement("button");
    btnDelete.className = "btn-delete";
    btnDelete.textContent = "x";
    item.append(element.title, btnDelete);
    list?.append(item)

    btnDelete.addEventListener("click", () => {
      deletTask(element.id)
    });
  });

  if (tasks.length > 0) {
    printFooter()
  }

}
printList(tasks);

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if (taskJSON == null) return []
  return JSON.parse(taskJSON)
}

function deletTask(id: string) {
  footer.innerHTML = ""
  const searchID = tasks.find((task: Task) => task.id === id);
  tasks = tasks.filter((task: Task) => { return task !== searchID });
  saveTasks();
  printList(tasks);
  input?.focus()
}

function printFooter() {
  const p = document.createElement("p");
  p.textContent = `You have ${tasks.length} pending tasks`;
  const btnRemove = document.createElement("button")
  btnRemove.className = "btn-remove"
  btnRemove.textContent = "Remove all"
  btnRemove.addEventListener("click", removeAll)
  footer.append(p, btnRemove);
  main?.append(footer);
}

function removeAll() {
  localStorage.removeItem("TASKS")
  window.location.reload()
}