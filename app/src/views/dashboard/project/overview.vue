<template>
  <div class="flex gap-4 flex-col">
    <RouterView />
    <TaskDialog
      v-if="$route.params.task_id"
      :project="project"
      :redirect="{
        name: routeName,
        params: { project_id: this.$route.params.project_id },
      }"
    />
    <SprintDialog
      v-if="$route.params.sprint_id"
      :project="project"
      :redirect="{
        name: routeName,
        params: { project_id: this.$route.params.project_id },
      }"
    />
  </div>
</template>

<script>
import { Card, CardContent } from "@/components/ui/card";
import { Plus, UnfoldVertical, FoldVertical } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TaskDialog from "@/components/tasks/dialog.vue";
import SprintDialog from "@/components/sprint/dialog.vue";
import Tabs from "@/components/projects/overview/tabs/tabs.vue";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  components: {
    Tabs,
    TaskDialog,
    Badge,
    Input,
    Card,
    CardContent,
    Plus,
    Button,
    FoldVertical,
    UnfoldVertical,
    SprintDialog,
  },
  data() {
    return {
      listType: this.$route.params.list_type ?? "list",
      links: [],
      search: "",
    };
  },
  computed: {
    doUpdate() {
      return this.$store.state.update;
    },
    routeName() {
      return this.$store.state.redirect;
    },
  },
  watch: {
    listType() {
      this.$router.push({
        name: "overview_type",
        params: {
          id: this.$route.params.id,
          list_type: this.listType,
        },
      });
    },
  },
};
</script>
