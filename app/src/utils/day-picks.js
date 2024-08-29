import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  limit,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/utils/firebase.js";
import store from "@/store";

const getDayPicks = async () => {
  const qDayPicks = query(
    collection(firestore, "day-picks"),
    where("account_id", "==", store.state.account.id),
    orderBy("created_at", "desc"),
    limit(2)
  );
  const dayPicksDocs = await getDocs(qDayPicks);
  return dayPicksDocs.docs;
};

const getDayPick = async (dayPickId) => {
  const dayPickDoc = await getDoc(doc(firestore, "day-picks", dayPickId));
  return dayPickDoc;
};

const createDayPicks = async (dayPicks) => {
  dayPicks.created_at = new Date();
  dayPicks.updated_at = new Date();
  dayPicks.account_id = store.state.account.id;
  await addDoc(collection(firestore, "day-picks"), dayPicks);
};

const updateDayPicks = async (dayPickId, dayPick) => {
  const dayPickDoc = await getDayPick(dayPickId);
  await setDoc(doc(firestore, "day-picks", dayPickId), {
    ...dayPickDoc.data(),
    ...dayPick,
    updated_at: new Date(),
  });
};

export { getDayPicks, createDayPicks, updateDayPicks };
