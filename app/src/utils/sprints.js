import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/utils/firebase.js";
import store from "@/store";
import router from "@/router";
import { createNotification } from "./notifications";
import { getProject } from "./projects";

const sprintStatuses = [
  {
    name: "pending",
    label: "Pending",
  },
  {
    name: "in_progress",
    label: "In Progress",
  },
  {
    name: "completed",
    label: "Completed",
  },
];

const createSprint = async ({ data }) => {
  const project = await getProject({ id: data.project_id });
  const sprint = await addDoc(collection(firestore, "sprints"), {
    ...data,
    archived: false,
    created_by: store.state.account.id,
    updated_at: new Date(),
    created_at: new Date(),
    status: sprintStatuses[0],
  });
  createNotification({
    data: {
      type: "sprint",
      message: `new sprint ${data.name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  return sprint;
};

const updateSprint = async ({ id, data }) => {
  const project = await getProject({ id: data.project_id });
  const sprintRef = doc(firestore, "sprints", id);
  const sprint = await getDoc(sprintRef);
  setDoc(sprintRef, {
    ...sprint.data(),
    ...data,
    updated_at: new Date(),
  });
  createNotification({
    data: {
      type: "task",
      message: `updated sprint ${data.name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  store.commit("setUpdate", ["sprints"]);
};

const getSprints = async ({ project_id, all = false }) => {
  const queryParams = [where("project_id", "==", project_id)];
  if (!all) {
    queryParams.push(where("archived", "==", false));
  }
  queryParams.push(orderBy("updated_at", "desc"));
  queryParams.push(orderBy("created_at", "desc"));
  const qTasks = query(collection(firestore, "sprints"), ...queryParams);
  const taskDocs = await getDocs(qTasks);
  return taskDocs.docs;
};

const getSprint = async ({ id }) => {
  const sprintRef = doc(firestore, "sprints", id);
  const sprint = await getDoc(sprintRef);
  return sprint;
};

const archiveSprint = async ({ id }) => {
  store.commit("setDialog", {
    title: "Quer arquivar este sprint?",
    description: "Esta ação é irreversivel",
    action: () => doArchiveSprint({ id }),
  });
};

const doArchiveSprint = async ({ id }) => {
  const sprintRef = doc(firestore, "sprints", id);
  const sprint = await getDoc(sprintRef);
  setDoc(sprintRef, {
    ...sprint.data(),
    archived: true,
    updated_at: new Date(),
  });
  const project = await getProject({ id: sprint.data().project_id });
  createNotification({
    data: {
      type: "task",
      message: `archived sprint: ${sprint.data().name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  router.go();
};

export {
  createSprint,
  updateSprint,
  sprintStatuses,
  getSprints,
  getSprint,
  archiveSprint,
};
