import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  getCountFromServer,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/utils/firebase.js";
import store from "@/store";
import { createNotification } from "./notifications";
import { getProject } from "./projects";
import router from "@/router";

const taskStatuses = [
  {
    name: "backlog",
    label: "Backlog",
  },
  {
    name: "todo",
    label: "To-do",
  },
  {
    name: "in_progress",
    label: "In Progress",
  },
  {
    name: "in_review",
    label: "In Review",
  },
  {
    name: "completed",
    label: "Completed",
  },
];

const taskStatusesBacklog = [
  {
    name: "in_progress",
    label: "In Progress",
  },
  {
    name: "todo",
    label: "To-do",
  },
  {
    name: "backlog",
    label: "Backlog",
  },
];

const taskStatusesKanban = [
  {
    name: "todo",
    label: "To-do",
  },
  {
    name: "in_progress",
    label: "In Progress",
  },
  {
    name: "in_review",
    label: "In Review",
  },
];

const taskStatusesList = [
  {
    name: "in_review",
    label: "In Review",
  },
  {
    name: "in_progress",
    label: "In Progress",
  },
  {
    name: "todo",
    label: "To-do",
  },
];

const taskTypes = [
  {
    name: "bug",
    label: "Bug",
  },
  {
    name: "feature",
    label: "Feature",
  },
  {
    name: "enhancement",
    label: "Enhancement",
  },
];

const countTasks = async ({ project_id }) => {
  const qTasks = query(
    collection(firestore, "tasks"),
    where("project_id", "==", project_id)
  );
  const taskDocs = await getCountFromServer(qTasks);
  return taskDocs.data().count;
};

const createTask = async ({ data }) => {
  const taskCount = await countTasks({ project_id: data.project_id });
  const project = await getProject({ id: data.project_id });
  const branch = `${project.data().project_suffix}-${taskCount}-${data.name}`
    .toLowerCase()
    .replace(/ /g, "-");
  const task = await addDoc(collection(firestore, "tasks"), {
    ...data,
    code: `${project.data().project_suffix}-${taskCount}`,
    branch,
    status: taskStatuses[0],
    archived: false,
    created_by: store.state.account.id,
    updated_at: new Date(),
    created_at: new Date(),
  });
  createNotification({
    data: {
      type: "task",
      message: `new task: ${data.name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  store.commit("setUpdate", ["tasks"]);
  return task;
};

const updateTask = async ({ id, data }) => {
  const taskRef = doc(firestore, "tasks", id);
  const task = await getDoc(taskRef);
  const taskData = setDoc(taskRef, {
    ...task.data(),
    ...data,
    updated_at: new Date(),
  });
  const project = await getProject({ id: task.data().project_id });
  createNotification({
    data: {
      type: "task",
      message: `updated task: ${data.name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  store.commit("setUpdate", ["tasks"]);
  return taskData;
};

const getTasks = async ({ project_id, all = false }) => {
  const queryParams = [where("project_id", "==", project_id)];
  if (!all) {
    queryParams.push(where("archived", "==", false));
  }
  queryParams.push(orderBy("updated_at", "desc"));
  queryParams.push(orderBy("created_at", "desc"));
  const qTasks = query(collection(firestore, "tasks"), ...queryParams);
  const taskDocs = await getDocs(qTasks);
  return taskDocs.docs;
};

const getTask = async ({ id }) => {
  const taskRef = doc(firestore, "tasks", id);
  const task = await getDoc(taskRef);
  return task;
};

const archiveTask = async ({ id }) => {
  store.commit("setDialog", {
    title: "Quer arquivar esta tarefa?",
    description: "Esta ação é irreversivel",
    action: () => doArchiveTask({ id }),
  });
};

const doArchiveTask = async ({ id }) => {
  const taskRef = doc(firestore, "tasks", id);
  const task = await getDoc(taskRef);
  setDoc(taskRef, {
    ...task.data(),
    archived: true,
    updated_at: new Date(),
  });
  const project = await getProject({ id: task.data().project_id });
  createNotification({
    data: {
      type: "task",
      message: `archived task: ${task.data().name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  router.go();
};

const getProjectTimeSpent = async ({ project_id }) => {
  const tasks = await getTasks({ project_id, all: true });
  let timeSpent = 0;
  tasks.forEach((task) => {
    if (task.data().time_spent) timeSpent += task.data().time_spent;
  });
  if (timeSpent === 0) return null;
  return formatTimeSpent(timeSpent);
};

const formatTimeSpent = (timeSpent) => {
  const timeSpentMillis = timeSpent;
  const timeSpentSeconds = timeSpentMillis / 1000;
  const minutes = Math.floor((timeSpentSeconds % 3600) / 60);
  const hours = Math.floor(timeSpentSeconds / 3600);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  return `${years > 0 ? `${years}y` : ""} 
    ${months > 0 ? `${months}m` : ""} 
    ${weeks > 0 ? `${weeks}w` : ""} 
    ${days > 0 ? `${days}d` : ""} 
    ${hours > 0 ? `${hours}h` : ""} 
    ${minutes > 0 ? `${minutes}m` : ""}`;
};

export {
  createTask,
  updateTask,
  countTasks,
  getTasks,
  getTask,
  archiveTask,
  taskStatuses,
  taskTypes,
  taskStatusesBacklog,
  taskStatusesList,
  taskStatusesKanban,
  getProjectTimeSpent,
  formatTimeSpent,
};
