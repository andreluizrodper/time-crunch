<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Badge>{{ task.data().status.label }}</Badge>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="status in listTaskStatuses"
        :key="status.name"
        @click="doUpdateTaskStatus(status)"
      >
        {{ status.label }}
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
import { taskStatuses, updateTask } from "@/utils/tasks";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  components: {
    Badge,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
  },
  computed: {
    listTaskStatuses() {
      return taskStatuses;
    },
  },
  methods: {
    async doUpdateTaskStatus(status) {
      updateTask({ id: this.task.id, data: { status } }).then(() => {
        this.$emit("update");
        this.$store.commit("addToast", {
          description: "Status atualizado",
        });
      });
    },
  },
};
</script>
