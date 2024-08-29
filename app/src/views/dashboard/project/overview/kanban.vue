<template>
  <div class="flex flex-col gap-4">
    <TopBar
      :showExpansion="false"
      :isExpanded="isExpanded"
      :showAddTask="true"
      @search="updateSearch"
    />
    <div v-if="loading">
      <div class="flex py-6 justify-center">
        <Loading />
      </div>
    </div>
    <div v-if="!loading" class="flex overflow-x-auto gap-4">
      <KanbanColumn
        v-for="status in statuses"
        :key="status"
        :status="status"
        :tasks="tasksFiltered"
        @update="update"
      />
    </div>
  </div>
</template>

<script>
import { taskStatusesKanban } from "@/utils/tasks";
import KanbanColumn from "@/components/projects/overview/kanban/kanban-column.vue";
import TopBar from "@/components/projects/overview/top-bar.vue";
import { getTasks } from "@/utils/tasks";
import Loading from "@/components/ui/loading.vue";

export default {
  components: {
    KanbanColumn,
    TopBar,
    Loading,
  },
  computed: {
    isExpanded() {
      return this.$store.state.isExpanded;
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
      statuses: taskStatusesKanban,
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
    update() {
      this.getData();
    },
    updateSearch(term) {
      this.search = term;
    },
  },
};
</script>
