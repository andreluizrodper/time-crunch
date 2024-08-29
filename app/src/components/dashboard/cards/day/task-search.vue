<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost">Search tasks</Button>
    </SheetTrigger>
    <SheetContent class="flex flex-col min-w-[520px]">
      <SheetHeader>
        <SheetTitle>Tasks</SheetTitle>
      </SheetHeader>
      <Input type="search" placeholder="Search tasks" v-model="search" />
      <div class="space-y-2 overflow-y-auto py-2">
        <Button
          v-for="task in filteredTasks"
          :key="task.id"
          variant="outline"
          class="w-full flex justify-between"
          @click="setSelected(task.id)"
          :class="selected.includes(task.id) && 'bg-muted'"
        >
          <div>
            <span class="uppercase">{{ task.data().code }}</span> -
            {{ task.data().name }}
          </div>
          <Badge>{{ task.data().status.label }}</Badge>
        </Button>
      </div>
      <SheetFooter class="flex gap-4">
        <SheetClose as-child>
          <Button variant="ghost">Close</Button>
        </SheetClose>
        <SheetClose as-child>
          <Button
            :disabled="selected.length === 0"
            class="w-full"
            @click="defineDay"
            >That will be my day</Button
          >
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script>
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/utils/projects";
import { getTasks } from "@/utils/tasks";
import { Input } from "@/components/ui/input";
import { createDayPicks, updateDayPicks } from "@/utils/day-picks";
import { Badge } from "@/components/ui/badge";

export default {
  components: {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Button,
    SheetClose,
    SheetFooter,
    Input,
    Badge,
  },
  props: {
    todayPick: {
      type: Object,
    },
  },
  data() {
    return {
      projects: [],
      tasks: [],
      search: "",
      selected: [],
    };
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter((task) =>
        task.data().name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  async mounted() {
    this.projects = await getProjects();
    for (const project of this.projects) {
      const tasks = await getTasks({ project_id: project.id });
      const tasksFiltered = tasks.filter(
        (task) => !["completed", "backlog"].includes(task.data().status.name)
      );
      this.tasks = [...this.tasks, ...tasksFiltered];
    }
  },
  methods: {
    setSelected(taskId) {
      if (this.selected.includes(taskId)) {
        this.selected = this.selected.filter((id) => id !== taskId);
      } else {
        this.selected = [...this.selected, taskId];
      }
    },
    defineDay() {
      if (this.todayPick) {
        updateDayPicks(this.todayPick.id, {
          task_ids: [...this.todayPick.data().task_ids, ...this.selected],
        });
      } else {
        createDayPicks({
          task_ids: this.selected,
        });
      }
    },
  },
};
</script>
