<template>
  <div class="bg-muted min-w-80 border rounded p-2 flex flex-col gap-2">
    <p class="text-sm">{{ status.label }}</p>
    <KanbanColumnCard
      v-for="task in tasksFiltered"
      :key="task.id"
      :task="task"
      @update="update"
    />
  </div>
</template>

<script>
import KanbanColumnCard from "./kanban-column-card.vue";

export default {
  components: {
    KanbanColumnCard,
  },
  props: {
    status: {
      type: Object,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
  },
  computed: {
    tasksFiltered: {
      get() {
        return this.tasks.filter(
          (task) => task.data().status.name === this.status.name
        );
      },
      set(value) {
        value;
      },
    },
  },
  methods: {
    update() {
      this.$emit("update");
    },
  },
};
</script>
