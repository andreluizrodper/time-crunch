<template>
  <div class="flex flex-col gap-4">
    <TopBar
      :showExpansion="false"
      :showSearch="false"
      :isExpanded="isExpanded"
      :showAddTask="false"
      :showAddSprint="true"
    />
    <div v-if="loading">
      <div class="flex py-6 justify-center">
        <Loading />
      </div>
    </div>
    <div v-if="!loading">
      <div v-if="sprints.length === 0">
        <p class="text-center py-6 text-sm text-gray-400">
          There are no sprints so far, want to create one?
        </p>
      </div>
      <div v-if="sprints.length > 0" class="flex flex-col gap-2">
        <ListItem
          v-for="sprint in sprints"
          :key="sprint.id"
          @update="update"
          :sprint="sprint"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getSprints } from "@/utils/sprints";
import ListItem from "@/components/projects/overview/sprints/list-item.vue";
import TopBar from "@/components/projects/overview/top-bar.vue";
import Loading from "@/components/ui/loading.vue";

export default {
  components: {
    ListItem,
    TopBar,
    Loading,
  },
  computed: {
    isExpanded() {
      return this.$store.state.isExpanded;
    },
  },
  data() {
    return {
      loading: true,
      sprints: [],
      search: "",
    };
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      this.sprints = await getSprints({ project_id: this.$route.params.id });
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
