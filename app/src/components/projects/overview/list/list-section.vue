<template>
  <div v-if="tasksFiltered.length > 0">
    <div class="px-6 py-2 text-sm bg-muted flex justify-between items-center">
      <span> {{ status.label }} ({{ tasksFiltered.length }}) </span>
      <Button variant="ghost" size="xs" @click="isHidden = !isHidden">
        <ChevronUp v-if="!isHidden" size="14" />
        <ChevronDown v-if="isHidden" size="14" />
      </Button>
    </div>
    <div v-show="!isHidden" :class="isExpanded ? 'space-y-2 mt-2' : 'border-b'">
      <TaskListItem
        v-for="task in tasksFiltered"
        :isExpanded="isExpanded"
        :key="task.id"
        :task="task"
        @update="update"
      />
    </div>
  </div>
</template>

<script>
import TaskListItem from "@/components/projects/overview/list-item.vue";
import { ChevronUp, ChevronDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

export default {
  components: {
    TaskListItem,
    ChevronUp,
    ChevronDown,
    Button,
  },
  props: {
    tasks: {
      type: Array,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      required: true,
    },
    status: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tasksFiltered() {
      return this.tasks.filter(
        (task) => task.data().status.name === this.status.name
      );
    },
  },
  data() {
    return {
      isHidden: false,
    };
  },
  methods: {
    update() {
      this.$emit("update");
    },
  },
};
</script>
