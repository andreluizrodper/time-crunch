<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="xs">
        <EllipsisVertical size="14" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="doArchiveTask">
        <X size="16" class="mr-2" />
        Arquivar tarefa
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script>
import { EllipsisVertical, X } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { archiveTask } from "@/utils/tasks";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  components: {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    X,
    EllipsisVertical,
    Button,
  },
  methods: {
    async doArchiveTask() {
      this.$emit("update");
      await archiveTask({ id: this.task.id });
    },
  },
};
</script>
