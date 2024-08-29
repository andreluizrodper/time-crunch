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

const countComments = async ({ source }) => {
  const qComments = query(
    collection(firestore, "comments"),
    where("source", "==", source)
  );
  const commentsDocs = await getCountFromServer(qComments);
  return commentsDocs.data().count;
};

const sendComment = async ({ data, project }) => {
  addDoc(collection(firestore, "comments"), {
    ...data,
    archived: false,
    created_by: store.state.account.id,
    updated_at: new Date(),
    created_at: new Date(),
  });
  createNotification({
    data: {
      type: "comment",
      message: `new comment`,
      accounts: project.shared_with_minus_me,
    },
  });
  store.commit("setUpdate", ["tasks"]);
};

const getComments = async ({ source }) => {
  const qComments = query(
    collection(firestore, "comments"),
    where("source", "==", source),
    where("archived", "==", false),
    orderBy("created_at", "asc")
  );
  const commentsDocs = await getDocs(qComments);
  return commentsDocs.docs;
};

const archiveComment = async ({ id }) => {
  const taskRef = doc(firestore, "comments", id);
  const task = await getDoc(taskRef);
  setDoc(taskRef, {
    ...task.data(),
    archived: true,
    updated_at: new Date(),
  });
};

export { countComments, getComments, sendComment, archiveComment };
