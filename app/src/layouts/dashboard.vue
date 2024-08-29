<template>
  <div class="flex flex-col">
    <NavBar />
    <div v-if="account" class="p-4">
      <RouterView />
    </div>
    <Projects />
    <TasksForm />
    <SprintForm />
    <Links />
    <Team />
    <Dialog />
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import NavBar from "@/components/dashboard/ui/nav-bar.vue";
import Projects from "@/components/projects/form.vue";
import SprintForm from "@/components/sprint/form.vue";
import TasksForm from "@/components/tasks/form.vue";
import TasksDialog from "@/components/tasks/dialog.vue";
import Links from "@/components/links/form.vue";
import Team from "@/components/team/dialog.vue";
import Dialog from "@/components/ui/dialog.vue";

export default {
  components: {
    RouterView,
    NavBar,
    Projects,
    TasksForm,
    TasksDialog,
    Links,
    SprintForm,
    Team,
    Dialog,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
};
</script>
