<template>
  <div class="flex flex-col gap-4">
    <TopBar :showExpansion="true" :showAddTask="true" />
    <div v-if="loading">
      <div class="flex py-6 justify-center">
        <Loading />
      </div>
    </div>
    <div v-if="!loading">
      <div
        class="px-6 py-2 text-sm bg-tinted flex justify-between items-center rounded-t"
      >
        <span> Completed ({{ completedTasks?.length }}) </span>
      </div>
      <div class="divide-y">
        <CompletedSection
          v-for="(day, index) in getTasksByDay"
          :key="index"
          :day="day"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CompletedSection from "@/components/projects/overview/completed/completed-section.vue";
import { DateTime } from "luxon";
import TopBar from "@/components/projects/overview/top-bar.vue";
import { getTasks } from "@/utils/tasks";
import Loading from "@/components/ui/loading.vue";

export default {
  components: {
    CompletedSection,
    TopBar,
    Loading,
  },
  computed: {
    getDays() {
      return [
        ...new Set(
          this.completedTasks?.map((task) =>
            DateTime.fromJSDate(task.data().updated_at.toDate()).toFormat(
              "dd/MM/yyyy"
            )
          )
        ),
      ];
    },
    getTasksByDay() {
      return this.getDays?.map((day) => {
        return {
          date: day,
          tasks: this.completedTasks.filter(
            (task) =>
              DateTime.fromJSDate(task.data().updated_at.toDate()).toFormat(
                "dd/MM/yyyy"
              ) === day
          ),
        };
      });
    },
    completedTasks() {
      return (
        this.tasksFiltered?.filter(
          (task) => task.data().status.name === "completed"
        ) ?? null
      );
    },
    tasksFiltered() {
      return this.tasks.filter(
        (task) =>
          task.data().name.toLowerCase().includes(this.search.toLowerCase()) ||
          task.data().tagsParsed?.includes(this.search.toLowerCase())
      );
    },
  },
  data() {
    return {
      tasks: [],
      search: "",
      loading: true,
    };
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      this.tasks = await getTasks({ project_id: this.$route.params.id });
      this.loading = false;
    },
    updateSearch(term) {
      this.search = term;
    },
  },
};
</script>
