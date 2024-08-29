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
import { getAccount } from "./account";

const getNotifications = async () => {
  const qNotifications = query(
    collection(firestore, "notifications"),
    where("accounts", "array-contains", store.state.account.id),
    orderBy("created_at", "desc")
  );
  const notificationDocs = await getDocs(qNotifications);
  return notificationDocs.docs;
};

const createNotification = async ({ data }) => {
  const account = await getAccount({
    id: store.state.account.id,
    setStore: false,
  });
  addDoc(collection(firestore, "notifications"), {
    ...data,
    account: account.data(),
    read_by: [account.id],
    created_at: new Date(),
  });
};

const markNotificationAsRead = async ({ id }) => {
  const notificationRef = doc(firestore, "notifications", id);
  const notification = await getDoc(notificationRef);
  console.log(notification.data().read_by);
  setDoc(notificationRef, {
    ...notification.data(),
    read_by: [...notification.data().read_by, store.state.account.id],
  });
};

export { createNotification, markNotificationAsRead, getNotifications };
