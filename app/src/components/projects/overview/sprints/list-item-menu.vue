<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="xs">
        <EllipsisVertical size="14" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="doArchiveSprint">
        <X size="16" class="mr-2" />
        Arquivar sprint
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
import { archiveSprint } from "@/utils/sprints";

export default {
  props: {
    sprint: {
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
  emits: ["update"],
  methods: {
    async doArchiveSprint() {
      archiveSprint({ id: this.sprint.id });
    },
  },
};
</script>
