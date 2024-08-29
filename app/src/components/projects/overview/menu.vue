<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="xs">
        <EllipsisVertical size="14" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="toggleTeam">
        <Users size="16" class="mr-2" />
        Time
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="!project.data().archived"
        @click="doArchiveProject"
      >
        <X size="16" class="mr-2" />
        Arquivar projeto
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="project.data().archived"
        @click="doUnarchiveProject"
      >
        Recuperar projeto
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script>
import { EllipsisVertical, X, Users } from "lucide-vue-next";
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
import { archiveProject, unarchiveProject } from "@/utils/projects";

export default {
  props: {
    project: {
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
    Users,
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
    toggleTeam() {
      this.$store.commit("setTeamDialog", {
        status: true,
        project_id: this.project.id,
      });
    },
    async doArchiveProject() {
      await archiveProject({ id: this.project.id });
      this.$emit("getData");
    },
    async doUnarchiveProject() {
      await unarchiveProject({ id: this.project.id, unarchive: true });
      this.$emit("getData");
    },
  },
};
</script>
