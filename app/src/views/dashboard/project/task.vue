<template>
  <div class="flex gap-4 flex-col">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ToggleGroup v-model="listType" type="single">
          <ToggleGroupItem value="backlog"> Backlog </ToggleGroupItem>
          <ToggleGroupItem value="list">
            <AlignJustify size="14" />
          </ToggleGroupItem>
          <ToggleGroupItem value="kanban">
            <Kanban size="14" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button
          v-if="!project.data().archived"
          @click="toggleTask"
          size="sm"
          variant="outline"
          class="flex gap-2"
        >
          <Plus size="16" /> Tarefa
        </Button>
        <div class="flex gap-2">
          <Badge>{{ tasksFiltered.length }}</Badge>
          Tarefas
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <Input v-model="search" type="search" placeholder="Search..." />
        <Button
          v-if="listType === 'list'"
          size="sm"
          variant="outline"
          @click="toggleExpanded"
        >
          <UnfoldVertical v-if="!isExpanded" size="16" />
          <FoldVertical v-if="isExpanded" size="16" />
        </Button>
      </div>
    </div>
    <List
      v-if="listType === 'list'"
      :isExpanded="isExpanded"
      :tasksFiltered="tasksFiltered"
    />
    <Backlog
      v-if="listType === 'backlog'"
      :isExpanded="isExpanded"
      :tasksFiltered="tasksFiltered"
    />
    <KanbanList v-if="listType === 'kanban'" :tasksFiltered="tasksFiltered" />
    <div>
      <Button
        v-if="!project.data().archived"
        @click="toggleTask"
        size="sm"
        variant="outline"
        class="flex gap-2"
      >
        <Plus size="16" /> Tarefa
      </Button>
    </div>
  </div>
</template>

<script>
import { Card, CardContent } from "@/components/ui/card";
import { getTasks } from "@/utils/tasks";
import {
  Plus,
  UnfoldVertical,
  FoldVertical,
  AlignJustify,
  Kanban,
} from "lucide-vue-next";
import KanbanList from "@/components/projects/overview/kanban/kanban.vue";
import Backlog from "@/components/projects/overview/backlog/backlog.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import List from "@/components/projects/overview/list/list.vue";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  components: {
    KanbanList,
    Badge,
    Input,
    Card,
    CardContent,
    Plus,
    Button,
    FoldVertical,
    UnfoldVertical,
    AlignJustify,
    Kanban,
    ToggleGroup,
    ToggleGroupItem,
    List,
    Backlog,
  },
  data() {
    return {
      listType: this.$route.params.list_type ?? "list",
      isExpanded:
        window.localStorage.getItem("timeCrunchExpanded") === "true" ?? true,
      links: [],
      tasks: [],
      search: "",
    };
  },
  computed: {
    doUpdate() {
      return this.$store.state.update;
    },
    tasksFiltered() {
      return this.tasks.filter((task) =>
        task.data().name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  watch: {
    doUpdate() {
      if (this.doUpdate.includes("tasks")) {
        this.$store.commit(
          "setUpdate",
          this.doUpdate.filter((item) => item !== "tasks")
        );
        this.getData();
      }
    },
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
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.tasks = await getTasks({ project_id: this.$route.params.id });
    },
    toggleTask() {
      this.$store.commit("setTaskSheet", {
        status: true,
        project_id: this.$route.params.id,
      });
    },
    toggleExpanded() {
      window.localStorage.setItem(
        "timeCrunchExpanded",
        this.isExpanded ? "false" : "true"
      );
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>
