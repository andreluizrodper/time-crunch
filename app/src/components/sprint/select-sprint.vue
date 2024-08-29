<template>
  <DropdownMenu v-if="availableSprints.length > 0">
    <DropdownMenuTrigger class="justify-start">
      <Badge>{{ selectedSprint?.data().name ?? "Selecionar sprint" }} </Badge>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="sprint in availableSprints"
        :key="sprint.id"
        @click="doUpdateTaskSprint(sprint)"
        :disabled="selectedSprint && selectedSprint.id === sprint.id"
      >
        {{ sprint.data().name }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="doUpdateTaskRemoveSprint()">
        Remove sprint
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <div v-else-if="selectedSprint" class="flex items-center">
    <Badge class="opacity-40">{{ selectedSprint.data().name }}</Badge>
  </div>
</template>

<script>
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getSprints, getSprint, updateSprint } from "@/utils/sprints";
import { Plus } from "lucide-vue-next";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import { updateTask } from "@/utils/tasks";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  components: {
    AccountAvatar,
    Plus,
    Badge,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
  },
  data() {
    return {
      sprints: [],
      selectedSprintTmp: this.task.data().sprint,
    };
  },
  computed: {
    availableSprints() {
      return this.sprints.filter(
        (sprint) =>
          !sprint.data().archived && sprint.data().status?.name !== "completed"
      );
    },
    selectedSprint() {
      return this.sprints.find(
        (sprint) => sprint.id === this.selectedSprintTmp
      );
    },
  },
  async mounted() {
    this.sprints = await getSprints({
      project_id: this.task.data().project_id,
      all: true,
    });
  },
  emits: ["update"],
  methods: {
    async doUpdateTaskSprint(sprint) {
      this.selectedSprintTmp = sprint.id;
      const past_sprints = [
        ...(this.task.data().past_sprints ?? []),
        this.task.data().sprint,
      ];
      const sprintData = await getSprint({ id: sprint.id });
      const selected = sprintData.data().selected ?? [];
      selected.push(this.task.id);
      updateSprint({
        id: sprint.id,
        data: { selected, project_id: this.$route.params.id },
      });
      updateTask({
        id: this.task.id,
        data: {
          sprint: sprint.id,
          past_sprints,
        },
      });
    },
    async doUpdateTaskRemoveSprint() {
      const past_sprints = [
        ...(this.task.data().past_sprints ?? []),
        this.task.data().sprint,
      ];
      const sprintData = await getSprint({ id: sprint.id });
      const newSelected = sprintData
        .data()
        .selected.filter((id) => this.task.id);
      this.selectedSprintTmp = "";
      updateSprint({
        id: this.task.data().sprint,
        data: { selected: newSelected, project_id: this.$route.params.id },
      });
      updateTask({
        id: this.task.id,
        data: {
          sprint: "",
          past_sprints,
        },
      });
    },
  },
};
</script>
