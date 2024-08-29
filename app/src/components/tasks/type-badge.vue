<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Badge v-if="task.data().type?.label">
        {{ task.data().type?.label }}
      </Badge>
      <Badge variant="outline" v-else> <Plus size="12" /> Tipo </Badge>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="taskType in listTaskTypes"
        :key="taskType.name"
        @click="doUpdateTaskType(taskType)"
      >
        {{ taskType.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script>
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { taskTypes, updateTask } from "@/utils/tasks";
import { Plus } from "lucide-vue-next";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  components: {
    Plus,
    Badge,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
  },
  computed: {
    listTaskTypes() {
      return taskTypes;
    },
  },
  methods: {
    doUpdateTaskType(type) {
      updateTask({ id: this.task.id, data: { type } }).then(() => {
        this.$store.commit("addToast", {
          description: "Tipo atualizado",
        });
        this.$emit("getData");
      });
    },
  },
};
</script>
