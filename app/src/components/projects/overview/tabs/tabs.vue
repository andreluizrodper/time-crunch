<template>
  <div class="flex items-center gap-2">
    <TabItem v-for="(item, index) in items" :key="index" :item="item" />
  </div>
</template>

<script>
import TabItem from "./tab-item.vue";

export default {
  components: {
    TabItem,
  },
  data() {
    const project_id = this.$route.params.id;
    return {
      items: [
        {
          text: "Sprint",
          to: { name: "sprints", params: { id: project_id } },
        },
        {
          text: "Backlog",
          to: { name: "backlog", params: { id: project_id } },
        },
        {
          icon: "AlignJustify",
          to: { name: "list", params: { id: project_id } },
        },
        {
          icon: "Kanban",
          to: { name: "kanban", params: { id: project_id } },
          class: "hidden sm:flex",
        },
        {
          icon: "CheckCheck",
          to: { name: "completed", params: { id: project_id } },
        },
      ],
    };
  },
};
</script>
