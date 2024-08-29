import { createStore } from "vuex";
import { toasts, toastFunctions } from "@/components/ui/toast/store";
import { set } from "firebase/database";

export default createStore({
  state: {
    user: {},
    account: null,
    theme: "light",
    projectSheet: { status: false },
    taskSheet: { status: false },
    linkSheet: { status: false },
    sprintSheet: { status: false },
    toasts,
    update: [],
    dialog: null,
    teamDialog: { status: false },
    isExpanded:
      window.localStorage.getItem("timeCrunchExpanded") === "true" ?? true,
  },
  mutations: {
    ...toastFunctions,
    setDialog(state, data) {
      state.dialog = data;
    },
    setRedirect(state, data) {
      state.redirect = data;
    },
    setIsExpanded(state, data) {
      window.localStorage.setItem(
        "timeCrunchExpanded",
        data ? "true" : "false"
      );
      state.isExpanded = data;
    },
    setTeamDialog(state, data) {
      state.teamDialog = data;
    },
    setProjectSheet(state, data) {
      state.projectSheet = data;
    },
    setUpdate(state, data) {
      state.update = data;
    },
    setTaskSheet(state, data) {
      state.taskSheet = data;
    },
    setSprintSheet(state, data) {
      state.sprintSheet = data;
    },
    setLinkSheet(state, data) {
      state.linkSheet = data;
    },
    setTheme(state, data) {
      state.theme = data;
      document.getElementsByTagName("html")[0].setAttribute("class", data);
      window.localStorage.setItem("theme_timecrunch", data);
    },
    setUser(state, data) {
      state.user = data;
    },
    setAccount(state, data) {
      state.account = data;
    },
  },
});
