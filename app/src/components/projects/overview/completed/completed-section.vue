<template>
  <div>
    <div class="px-6 py-2 text-sm bg-muted flex justify-between items-center">
      <Button
        variant="ghost"
        class="w-full text-left px-0"
        size="sm"
        @click="isExpanded = !isExpanded"
      >
        <span class="w-full"> {{ day.date }} ({{ day.tasks.length }}) </span>
        <ChevronUp v-if="!isExpanded" size="14" />
        <ChevronDown v-if="isExpanded" size="14" />
      </Button>
    </div>
    <div v-if="isExpanded">
      <TaskListItem
        v-for="(task, index) in day.tasks"
        :key="index"
        :task="task"
        :isExpanded="false"
        :showPlay="false"
        :showTimeSpent="true"
      />
    </div>
  </div>
</template>

<script>
import TaskListItem from "@/components/projects/overview/list-item.vue";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-vue-next";

export default {
  components: {
    TaskListItem,
    Button,
    ChevronUp,
    ChevronDown,
  },
  props: {
    day: {
      type: Object,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    };
  },
};
</script>
