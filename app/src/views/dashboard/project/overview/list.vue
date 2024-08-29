<template>
  <div class="flex flex-col gap-4">
    <TopBar
      :showExpansion="true"
      :isExpanded="isExpanded"
      :showAddTask="true"
      @search="updateSearch"
    />
    <div v-if="loading">
      <div class="flex py-6 justify-center">
        <Loading />
      </div>
    </div>
    <div v-if="!loading" class="flex gap-4 flex-col">
      <ListSection
        v-for="status in statuses"
        :key="status"
        :status="status"
        :isExpanded="isExpanded"
        :tasks="tasksFiltered"
        @update="update"
      />
    </div>
  </div>
</template>

<script>
import { getTasks } from "@/utils/tasks";
import { taskStatusesList } from "@/utils/tasks";
import ListSection from "@/components/projects/overview/list/list-section.vue";
import TopBar from "@/components/projects/overview/top-bar.vue";
import Loading from "@/components/ui/loading.vue";

export default {
  components: {
    ListSection,
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
      statuses: taskStatusesList,
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
