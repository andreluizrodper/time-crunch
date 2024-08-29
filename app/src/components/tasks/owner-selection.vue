<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="justify-start">
      <AccountAvatar
        v-if="task.data().assigned_to"
        :id="task.data().assigned_to"
        :showName="true"
      />
      <div
        v-else
        class="size-10 rounded-full bg-secondary flex items-center justify-center"
      >
        <Plus size="16" />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="account_id in project.data().shared_with"
        :key="account_id"
        @click="doUpdateTaskAssigned(account_id)"
      >
        <AccountAvatar :id="account_id" :showName="true" />
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
import AccountAvatar from "@/components/ui/account-avatar.vue";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
  },
  emits: ["getData"],
  components: {
    AccountAvatar,
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
    doUpdateTaskAssigned(assigned_to) {
      updateTask({ id: this.task.id, data: { assigned_to } }).then(() => {
        this.$emit("getData");
        this.$store.commit("addToast", {
          description: "Responsável atualizado com sucesso!",
        });
      });
    },
  },
};
</script>
