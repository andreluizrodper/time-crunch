<template>
  <div
    class="sticky top-12 py-2 bg-background flex flex-col gap-2 sm:flex-row sm:items-center justify-between border-b"
  >
    <Tabs />
    <div class="flex items-center gap-2">
      <Input
        v-if="showSearch"
        v-model="search"
        type="search"
        class="h-9"
        @input="updateSearch"
        placeholder="Search..."
      />
      <AddTask v-if="showAddTask" />
      <AddSprint v-if="showAddSprint" />
      <div v-if="showExpansion">
        <Button size="sm" variant="outline" @click="toggleExpanded">
          <UnfoldVertical v-if="!isExpanded" size="16" />
          <FoldVertical v-if="isExpanded" size="16" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Tabs from "@/components/projects/overview/tabs/tabs.vue";
import AddTask from "@/components/tasks/add-task.vue";
import AddSprint from "@/components/sprint/add-sprint.vue";
import { UnfoldVertical, FoldVertical } from "lucide-vue-next";

export default {
  components: {
    Tabs,
    Button,
    Input,
    UnfoldVertical,
    FoldVertical,
    AddTask,
    AddSprint,
  },
  props: {
    showExpansion: {
      type: Boolean,
      required: true,
    },
    showAddSprint: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    showAddTask: {
      type: Boolean,
      required: true,
    },
    isExpanded: {
      type: Boolean,
    },
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    toggleExpanded() {
      this.$store.commit("setIsExpanded", !this.isExpanded);
    },
    updateSearch() {
      this.$emit("search", this.search);
    },
  },
};
</script>
