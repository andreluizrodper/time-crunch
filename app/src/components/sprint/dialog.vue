<template>
  <Dialog v-if="sprint" :open="!!sprint" @update:open="toggleOpen">
    <DialogContent class="min-h-[96vh] gap-1 min-w-[96vw] flex flex-col">
      <DialogHeader>
        <div>
          <div class="gap-2 flex">
            <div class="flex flex-col gap-1 w-full">
              <div class="flex gap-4 items-center">
                <PlayButton @update="getData" :sprint="sprint" />
                <DialogTitle class="flex items-center gap-2">
                  {{ sprint.data().name }}
                </DialogTitle>
              </div>
              <span class="text-xs flex items-center gap-2">
                criado em {{ createdAtFormated }} last update
                {{ updatedAtFormated }}
              </span>
            </div>
            <div class="flex gap-2">
              <Button @click="toggleOpen" variant="outline" size="sm">
                <X :size="14" />
              </Button>
            </div>
          </div>
        </div>
      </DialogHeader>
      <div class="flex-1 mt-2">
        <div class="flex flex-col sm:flex-row gap-4 w-full">
          <div class="w-full">
            <div class="flex flex-col border rounded">
              <div
                class="flex justify-between items-center h-14 bg-slate-50 px-2"
              >
                <p class="text-sm font-bold">Tarefas abertas</p>
                <div class="flex gap-2">
                  <Button
                    :disabled="selected.length < 1"
                    @click="addSelected"
                    variant="outline"
                    size="xs"
                    >Add</Button
                  >
                  <Button
                    variant="ghost"
                    size="xs"
                    @click="allIsHidden = !allIsHidden"
                  >
                    <ChevronUp v-if="!allIsHidden" size="14" />
                    <ChevronDown v-if="allIsHidden" size="14" />
                  </Button>
                </div>
              </div>
              <div v-show="!allIsHidden" class="divide-y border-t">
                <Input
                  v-model="search"
                  class="rounded-none border-0"
                  placeholder="Procurar..."
                />
                <div class="max-h-[70vh] overflow-y-auto">
                  <div class="flex flex-col divide-y">
                    <div
                      v-for="task in tasksFiltered"
                      :key="task.id"
                      class="p-2 flex justify-between"
                    >
                      <label
                        class="flex gap-2 items-center"
                        :for="`task-${task.id}`"
                      >
                        <input
                          type="checkbox"
                          v-model="selected"
                          :value="task.id"
                          :id="`task-${task.id}`"
                        />
                        <span class="text-sm">{{ task.data().name }}</span>
                      </label>
                      <TaskPointsPopOver :task="task" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full">
            <div class="flex flex-col border rounded">
              <div
                class="flex justify-between items-center h-14 bg-slate-50 px-2"
              >
                <p class="text-sm font-bold">Tarefas selecionadas</p>
                <div class="flex items-center gap-2">
                  <Button
                    :disabled="selectedRemove.length < 1"
                    @click="removeSelected"
                    variant="outline"
                    size="xs"
                    >Remove</Button
                  >
                  <Button
                    variant="ghost"
                    size="xs"
                    @click="selectedIsHidden = !selectedIsHidden"
                  >
                    <ChevronUp v-if="!selectedIsHidden" size="14" />
                    <ChevronDown v-if="selectedIsHidden" size="14" />
                  </Button>
                </div>
              </div>
              <div v-show="!selectedIsHidden" class="divide-y border-t">
                <Input
                  v-model="searchSelected"
                  class="rounded-none border-0"
                  placeholder="Procurar..."
                />
                <div class="max-h-[70vh] overflow-y-auto">
                  <div
                    v-if="tasksSelected.length"
                    class="flex flex-col divide-y"
                  >
                    <div
                      v-for="task in tasksSelectedFiltered"
                      :key="task.id"
                      class="p-2 flex justify-between"
                    >
                      <label
                        class="flex gap-2 items-center"
                        :for="`selected-task-${task.id}`"
                      >
                        <input
                          type="checkbox"
                          v-model="selectedRemove"
                          :value="task.id"
                          :id="`selected-task-${task.id}`"
                        />
                        <span class="text-sm">{{ task.data().name }}</span>
                      </label>
                      <TaskPointsPopOver @update="getData" :task="task" />
                    </div>
                    <div class="p-2 flex bg-slate-50 justify-between">
                      <span class="text-sm">Total de pontos:</span>
                      <Badge variant="outline">
                        {{ countSelectedPoints }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Comments :project="project" :source="`sprint-${sprint.id}`" />
    </DialogContent>
  </Dialog>
</template>

<script>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import Comments from "@/components/ui/comments/comments.vue";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import {
  Clock,
  Download,
  Trash,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-vue-next";
import { getSprint } from "@/utils/sprints";
import { getTasks } from "@/utils/tasks";
import { Input } from "@/components/ui/input";
import { updateSprint } from "@/utils/sprints";
import { updateTask } from "@/utils/tasks";
import TaskPointsPopOver from "@/components/tasks/points-pop-over.vue";
import { Badge } from "@/components/ui/badge";
import PlayButton from "@/components/sprint/play-button.vue";

export default {
  props: {
    redirect: {
      type: Object,
    },
    project: {
      type: Object,
      required: true,
    },
  },
  components: {
    Clock,
    X,
    Input,
    Badge,
    Comments,
    ChevronUp,
    ChevronDown,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    AccountAvatar,
    Download,
    Card,
    CardContent,
    Trash,
    CardFooter,
    TaskPointsPopOver,
    PlayButton,
  },
  data() {
    return {
      sprint: null,
      selected: [],
      selectedRemove: [],
      tasks: [],
      search: "",
      searchSelected: "",
      tasksSelected: [],
      allIsHidden: false,
      selectedIsHidden: false,
    };
  },
  computed: {
    countSelectedPoints() {
      return this.tasksSelected.reduce((acc, task) => {
        acc += parseInt(task.data().points ?? 0);
        return acc;
      }, 0);
    },
    createdAtFormated() {
      return DateTime.fromJSDate(
        this.sprint.data().created_at.toDate()
      ).toRelative();
    },
    updatedAtFormated() {
      return DateTime.fromJSDate(
        this.sprint.data().updated_at.toDate()
      ).toRelative();
    },
    account() {
      return this.$store.state.account;
    },
    tasksFiltered() {
      const tasks = this.tasks.filter((task) => {
        return (
          task.data().status.name !== "completed" &&
          !this.sprint.data().selected?.includes(task.id) &&
          task.data().name.toLowerCase().includes(this.search.toLowerCase())
        );
      });
      return tasks;
    },
    tasksSelectedFiltered() {
      const tasks = this.tasksSelected.filter((task) =>
        task
          .data()
          .name.toLowerCase()
          .includes(this.searchSelected.toLowerCase())
      );
      return tasks;
    },
  },
  mounted() {
    if (this.$route.params.sprint_id) {
      this.getData();
    }
  },
  methods: {
    addSelected() {
      const newSelected = [
        ...this.selected,
        ...(this.sprint.data().selected ?? []),
      ];
      updateSprint({
        id: this.sprint.id,
        data: { selected: newSelected, project_id: this.$route.params.id },
      }).then(() => {
        this.selected.forEach((id) => {
          const task = this.tasks.find((task) => task.id === id);
          const past_sprints =
            [...(task.data().past_sprints ?? []), task.data().sprint ?? ""] ??
            [];
          updateTask({
            id: task.id,
            data: { sprint: this.sprint.id, past_sprints },
          });
        });
        this.selected = [];
        this.getData();
      });
    },
    removeSelected() {
      const selectedIds = this.sprint.data().selected;
      const newSelected = [];
      for (const selectedId of selectedIds) {
        if (!this.selectedRemove.includes(selectedId))
          newSelected.push(selectedId);
      }
      updateSprint({
        id: this.sprint.id,
        data: { selected: newSelected, project_id: this.$route.params.id },
      }).then(() => {
        this.selectedRemove.forEach((id) => {
          const task = this.tasks.find((task) => task.id === id);
          const past_sprints =
            [...(task.data().past_sprints ?? []), task.data().sprint] ?? [];
          updateTask({
            id: task.id,
            data: { sprint: "", past_sprints },
          });
        });
        this.selected = [];
        this.getData();
      });
    },
    toggleOpen() {
      this.sprint = null;
      const redirect = this.$store.state.redirect;
      this.$router.push({
        name: redirect ?? "list",
        params: { id: this.$route.params.id },
      });
    },
    async getData() {
      this.sprint = await getSprint({ id: this.$route.params.sprint_id });
      this.tasks = await getTasks({
        project_id: this.$route.params.id,
      });
      this.tasksSelected = this.tasks.filter((task) =>
        this.sprint.data().selected?.includes(task.id)
      );
    },
  },
};
</script>
