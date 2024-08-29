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

const updateAccount = async ({ id, data }) => {
  try {
    const account = await getAccount({ id });
    const accountRef = doc(firestore, "accounts", id);
    await setDoc(accountRef, {
      ...account.data(),
      ...data,
      updated_at: new Date(),
    });
    getAccount({ id });
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const createAccount = async ({ data, setStore = true }) => {
  try {
    const uuid = uuidv4();
    data.uuid = uuid;
    const createdAccount = await addDoc(
      collection(firestore, "accounts"),
      data
    );
    if (setStore) getAccount({ id: createdAccount.id });
    return createdAccount;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getAccount = async ({ id, setStore = true }) => {
  const accountRef = doc(firestore, "accounts", id);
  const account = await getDoc(accountRef);
  if (setStore) store.commit("setAccount", account);
  return account;
};

const accountExists = async ({ id }) => {
  const qAccounts = query(
    collection(firestore, "accounts"),
    where("owner", "==", id)
  );
  const accountDocs = await getDocs(qAccounts);
  return !accountDocs.empty;
};

const loginAccount = async ({ id }) => {
  try {
    const qAccounts = query(
      collection(firestore, "accounts"),
      where("owner", "==", id)
    );
    const accountDocs = await getDocs(qAccounts);
    const account = accountDocs.docs[0];
    store.commit("setAccount", account);
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getAccountByEmail = async ({ email }) => {
  const qAccounts = query(
    collection(firestore, "accounts"),
    where("email", "==", email)
  );
  const accountDocs = await getDocs(qAccounts);
  if (!accountDocs.docs.length) return null;
  return accountDocs.docs[0];
};

const logOutAccount = async () => {};

export {
  accountExists,
  updateAccount,
  createAccount,
  getAccount,
  loginAccount,
  getAccountByEmail,
};
