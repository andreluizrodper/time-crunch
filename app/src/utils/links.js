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
} from "firebase/firestore";
import store from "@/store";
import { getProject } from "./projects";
import { createNotification } from "./notifications";

const createLink = async ({ data }) => {
  addDoc(collection(firestore, "links"), {
    ...data,
    archived: false,
    created_by: store.state.account.id,
    created_at: new Date(),
  });
  const project = await getProject({ id: data.project_id });
  createNotification({
    data: {
      type: "link",
      message: `new link: ${data.name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  store.commit("setUpdate", ["links"]);
};

const updateLink = async ({ id, data }) => {
  const linkRef = doc(firestore, "links", id);
  const link = await getDoc(linkRef);
  setDoc(linkRef, {
    ...link.data(),
    ...data,
    updated_at: new Date(),
  });
  const project = await getProject({ id: link.data().project_id });
  createNotification({
    data: {
      type: "link",
      message: `updated link: ${data.name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  store.commit("setUpdate", ["links"]);
};

const getLinks = async ({ project_id, all = false }) => {
  const queryParams = [where("project_id", "==", project_id)];
  if (all) {
    queryParams.push(where("archived", "==", true));
  } else {
    queryParams.push(where("archived", "==", false));
  }
  const qLinks = query(collection(firestore, "links"), ...queryParams);
  const linkDocs = await getDocs(qLinks);
  return linkDocs.docs;
};

const getLink = async ({ id }) => {
  const linkRef = doc(firestore, "links", id);
  const link = await getDoc(linkRef);
  return link;
};

const archiveLink = async ({ id }) => {
  const linkRef = doc(firestore, "links", id);
  const link = await getDoc(linkRef);
  setDoc(linkRef, {
    ...link.data(),
    archived: true,
    updated_at: new Date(),
  });
  const project = await getProject({ id: link.data().project_id });
  createNotification({
    data: {
      type: "link",
      message: `archived link: ${link.data().name}`,
      accounts: project.shared_with_minus_me,
    },
  });
  store.commit("setUpdate", ["links"]);
};

export { createLink, updateLink, getLinks, getLink, archiveLink };
