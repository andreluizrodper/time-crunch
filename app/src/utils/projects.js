import { v4 as uuidv4 } from "uuid";
import { firestore } from "@/utils/firebase.js";
import {
  doc,
  getDoc,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
  orderBy,
} from "firebase/firestore";
import store from "@/store";
import router from "@/router";

const getProjects = async (all = false) => {
  const account_id = store.state.account.id;
  const queryParams = [
    where("shared_with", "array-contains-any", [account_id]),
  ];
  if (all) {
    queryParams.push(where("archived", "==", true));
  } else {
    queryParams.push(where("archived", "==", false));
  }
  queryParams.push(orderBy("updated_at", "desc"));
  const qProjects = query(collection(firestore, "projects"), ...queryParams);
  const projectDocs = await getDocs(qProjects);
  return projectDocs.docs;
};

const getProject = async ({ id }) => {
  const projectRef = doc(firestore, "projects", id);
  const project = await getDoc(projectRef);
  if (!project.data().shared_with.includes(store.state.account.id))
    return false;
  project.shared_with_minus_me = project
    .data()
    .shared_with.filter((id) => id !== store.state.account.id);
  return project;
};

const createProject = async ({ data }) => {
  try {
    const uuid = uuidv4();
    data.uuid = uuid;
    data.shared_with = [store.state.account.id];
    data.owner = store.state.account.id;
    data.archived = false;
    data.created_at = new Date();
    data.updated_at = new Date();
    data.project_suffix = data.name
      .split(" ")
      .map((word) => word[0])
      .join("");
    const project = await addDoc(collection(firestore, "projects"), data);
    return project;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const updateProject = async ({ id, data }) => {
  try {
    const project = await getProject({ id });
    if (!project) return false;
    const projectRef = doc(firestore, "projects", id);
    await setDoc(projectRef, {
      ...project.data(),
      ...data,
      updated_at: new Date(),
    });
    getProject({ id });
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const archiveProject = async ({ id }) => {
  store.commit("setDialog", {
    title: "Quer arquivar este project?",
    description: "Esta ação é irreversivel",
    action: () => doArchiveProject({ id }),
  });
};

const doArchiveProject = async ({ id }) => {
  try {
    const project = await getProject({ id });
    if (!project) return false;
    const projectRef = doc(firestore, "projects", id);
    await setDoc(projectRef, {
      ...project.data(),
      archived: true,
      updated_at: new Date(),
    });
    router.go();
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const unarchiveProject = async ({ id }) => {
  try {
    const project = await getProject({ id });
    if (!project) return false;
    const projectRef = doc(firestore, "projects", id);
    await setDoc(projectRef, {
      ...project.data(),
      archived: false,
      updated_at: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  archiveProject,
  unarchiveProject,
};
